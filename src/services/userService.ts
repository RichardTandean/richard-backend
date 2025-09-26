import { prisma } from '@/models';
import { CustomError } from '@/utils/errorHandler';
import { UserListQuery, PaginatedResponse, User } from '@/types';

export class UserService {
  async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'passwordHash'>;
  }

  async updateProfile(
    userId: string, 
    data: { name?: string; avatarUrl?: string }
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl })
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'passwordHash'>;
  }

  async getUsers(query: UserListQuery): Promise<PaginatedResponse<Omit<User, 'passwordHash'>>> {
    const { q, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } }
      ]
    } : {};

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users as Omit<User, 'passwordHash'>[],
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    return user as Omit<User, 'passwordHash'>;
  }
}
