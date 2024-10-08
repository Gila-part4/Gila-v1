'use client';

/* eslint-disable no-underscore-dangle */

import React, { useCallback, useState, useEffect, useTransition } from 'react';
import MyActivityCard from '@/app/(protected)/(user)/dashboard/my-activity/_components/my-activity-card';
import { getMyActivities } from '@/app/data/activity';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { ActivityWithFavoriteAndCount } from '@/type';
import Image from 'next/image';
import MyActivityCardSkeleton from '@/components/skeletons/my-activity-card-skeleton';

interface Props {
  myActivities: ActivityWithFavoriteAndCount[];
  activityCursorId: string | null;
}

export default function MyActivityList({ myActivities, activityCursorId }: Props) {
  const [activityList, setActivityList] = useState<ActivityWithFavoriteAndCount[]>([]);
  const [cursorId, setCursorId] = useState(activityCursorId);
  const [isPending, startTransition] = useTransition();

  const loadMoreActivities = useCallback(async () => {
    startTransition(async () => {
      if (!cursorId) return;
      const result = await getMyActivities({ take: 7, cursor: cursorId });
      setActivityList((prev) => [...prev, ...result.activities]);
      setCursorId(result.cursorId);
    });
  }, [cursorId]);

  useEffect(() => {
    setActivityList([...myActivities]);
    setCursorId(activityCursorId);
  }, [myActivities, activityCursorId]);

  const observer = useInfiniteScroll({
    callback: loadMoreActivities,
    cursorId,
    isLoading: isPending,
  });

  if (myActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center font-semibold -translate-y-16 h-screen-minus-134 gap-5">
        <Image src="/GrayLogo.svg" width={150} height={50} alt="회색 로고" />
        <p className="text-center text-lg">
          오른쪽 위에 플러스 버튼을 눌러
          <br /> 길라가 되어보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col w-full gap-6">
        {activityList.map((myActivity) => (
          <li key={myActivity.id}>
            <MyActivityCard activity={myActivity} />
          </li>
        ))}
        <div ref={observer} />
      </ul>
      {isPending && (
        <div className="flex justify-center w-full">
          <MyActivityCardSkeleton />
        </div>
      )}
    </>
  );
}
