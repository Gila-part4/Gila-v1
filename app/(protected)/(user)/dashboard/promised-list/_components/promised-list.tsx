'use client';

import { RequestWithReqUserAndActivity } from '@/type';
import PromisedListCard from '@/app/(protected)/(user)/dashboard/promised-list/_components/promised-list-card';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { getMyReceivedRequests } from '@/app/data/activity-request';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Spinner from '@/components/ui/spinner';

interface Props {
  promisedActivities: RequestWithReqUserAndActivity[];
  cursorId: string | null;
}

export default function PromisedList({ promisedActivities, cursorId }: Props) {
  const [infinityPromisedActivities, setInfinityPromisedActivities] = useState<
    RequestWithReqUserAndActivity[]
  >([]);
  const [infinityCursorId, setInfinityCursorId] = useState(cursorId);
  const [isPending, startTransition] = useTransition();

  const loadMorePromisedActivities = useCallback(async () => {
    startTransition(async () => {
      if (!infinityCursorId) return;
      const result = await getMyReceivedRequests({
        take: 10,
        cursor: infinityCursorId,
      });
      setInfinityCursorId(result.cursorId);
      setInfinityPromisedActivities((prev) => [...result.requests, ...prev]);
    });
  }, [infinityCursorId]);

  useEffect(() => {
    setInfinityPromisedActivities([...promisedActivities]);
    setInfinityCursorId(cursorId);
  }, [cursorId, promisedActivities]);

  const observer = useInfiniteScroll({
    callback: loadMorePromisedActivities,
    cursorId: infinityCursorId,
    isLoading: isPending,
  });

  return (
    <>
      <ul>
        {promisedActivities.length > 0 ? (
          <>
            {infinityPromisedActivities.map((activity) => (
              <li key={activity.id}>
                <PromisedListCard promisedActivity={activity} />
              </li>
            ))}
            <div ref={observer} />
          </>
        ) : (
          <div>none</div>
        )}
      </ul>
      {isPending && <Spinner />}
    </>
  );
}
