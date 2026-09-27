import { TimelineEvent } from '@/services/mockData';
import { DEMO_TIMELINE } from '@/services/mockData';

export const timelineService = {
  async getTimelineEvents(_patientId: string): Promise<TimelineEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_TIMELINE]), 80);
    });
  },
};
