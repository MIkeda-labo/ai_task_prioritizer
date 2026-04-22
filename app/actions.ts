'use server'

import { prioritizeUserTasks } from '@/lib/ai';

export async function prioritizeTasksAct(profile: string, situation: string, tasks: string[]) {
  try {
    const data = await prioritizeUserTasks(profile, situation, tasks);
    return data;
  } catch (error: any) {
    console.error('Server Action Error:', error);
    throw new Error(error.message || 'Failed to prioritize tasks.');
  }
}

