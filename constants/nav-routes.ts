'use client';

import {
  CheckCircle,
  Clipboard,
  Heart,
  HelpCircle,
  Star,
  LucideIcon,
  HeartHandshake,
  MessageCircleQuestion,
  LayoutDashboard,
} from 'lucide-react';

const dashboardPrefix = '/dashboard';

export interface Route {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const DASHBOARD_ROUTES: Route[] = [
  { icon: LayoutDashboard, label: '대시보드', href: `${dashboardPrefix}/my-activity` },
  { icon: Clipboard, label: '신청한 활동', href: `${dashboardPrefix}/promise-list` },
  { icon: CheckCircle, label: '신청 현황', href: `${dashboardPrefix}/promised-list` },
  { icon: Heart, label: '찜 목록', href: `${dashboardPrefix}/wishlist` },
  { icon: HelpCircle, label: '내 질문', href: `${dashboardPrefix}/my-question` },
  { icon: Star, label: '리뷰', href: `${dashboardPrefix}/reviews` },
];

export const MAIN_ROUTES: Route[] = [
  { icon: HeartHandshake, label: '길리 찾기', href: '/activity-list' },
  { icon: MessageCircleQuestion, label: '질문 하기', href: '/question-list' },
  { icon: LayoutDashboard, label: '대시보드', href: `${dashboardPrefix}/my-activity` },
];
