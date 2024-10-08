'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ActivityListCard from '@/app/(protected)/(main)/activity-list/_components/activity-list-card';
import { getActivities } from '@/app/data/activity';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { ActivityWithUserAndFavoCount, Sort } from '@/type';
import ActivityCardSkeleton from '@/components/skeletons/activity-card-skeleton';
import Image from 'next/image';
import ActivitySlideContainer from './activity-slide-container';

interface Props {
  activities: ActivityWithUserAndFavoCount[];
  cursorId: string | null;
  sort: Sort;
  location: string;
}

export default function ActivityList({ activities, cursorId, sort, location }: Props) {
  const [infinityActivities, setInfinityActivities] = useState<ActivityWithUserAndFavoCount[]>([]);
  const [infinityCursorId, setInfinityCursorId] = useState<string | null>('');
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const loadMoreActivities = useCallback(async () => {
    startTransition(async () => {
      if (!infinityCursorId) return;
      const result = await getActivities({
        type: sort,
        cursor: infinityCursorId,
        size: 5,
        location,
      });
      setInfinityCursorId(result.cursorId);
      setInfinityActivities((prev) => [...prev, ...result.activities]);
    });
  }, [infinityCursorId, location, sort]);

  const observer = useInfiniteScroll({
    callback: loadMoreActivities,
    isLoading: isPending,
    cursorId: infinityCursorId,
  });

  useEffect(() => {
    setInfinityActivities([...activities]);
    setInfinityCursorId(cursorId);
  }, [activities, cursorId, location, sort]);

  if (activities.length === 0 && searchParams.get('sort') === 'tag') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <span>관심사를 먼저 설정해 주세요!</span>
        <Link
          href="/topic"
          className="flex items-center justify-center px-4 py-3 font-semibold rounded-lg bg-primary text-white_light hover:bg-primary_dark"
        >
          관심사 정하기
        </Link>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-[50vh] gap-5">
        <Image src="/GrayLogo.svg" width={150} height={50} alt="회색 로고" />
        <p className="text-center text-xl font-bold">
          <span className="text-xl text-primary">{location}</span>에<br /> 아직 등록된 길라가
          없습니다.
        </p>
        <Link
          href="/activity-list"
          className="flex items-center justify-center px-4 py-3 font-semibold rounded-lg bg-primary text-white_light hover:bg-primary_dark"
        >
          전체 리스트 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col w-full gap-6">
        <ActivitySlideContainer />
        {infinityActivities.map((activity) => (
          <li key={activity.id}>
            <ActivityListCard activity={activity} />
          </li>
        ))}
        <div ref={observer} />
      </ul>
      {isPending && <ActivityCardSkeleton />}
    </>
  );
}
