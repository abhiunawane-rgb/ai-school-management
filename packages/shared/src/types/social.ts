export interface FeedPost {
  id: string;
  tenantId: string;
  authorId: string;
  authorRole: string;
  content: string;
  mediaUrls: string[];
  classId?: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
}

export interface OnlineClass {
  id: string;
  tenantId: string;
  title: string;
  classId: string;
  teacherId: string;
  meetingUrl: string;
  provider: 'zoom' | 'google_meet' | 'custom';
  scheduledAt: string;
  durationMinutes: number;
  recordingUrl?: string;
}

export interface GalleryAlbum {
  id: string;
  tenantId: string;
  title: string;
  eventId?: string;
  coverUrl?: string;
  photoCount: number;
  createdAt: string;
}
