import { prisma } from "@/lib/prisma";

// Midnight today — same-day events still count as "upcoming" all day.
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Upcoming = effective end date (endDate, or startDate for single-day events) is today or later.
export async function getUpcomingEvents() {
  const today = startOfToday();
  return prisma.event.findMany({
    where: {
      OR: [
        { endDate: { gte: today } },
        { AND: [{ endDate: null }, { startDate: { gte: today } }] },
      ],
    },
    orderBy: { startDate: "asc" },
  });
}

// All events, most recent first — for the admin list (includes past events, which stay editable/deletable).
export async function getAllEvents() {
  return prisma.event.findMany({ orderBy: { startDate: "desc" } });
}

export async function getEvent(id: string) {
  return prisma.event.findUnique({ where: { id } });
}
