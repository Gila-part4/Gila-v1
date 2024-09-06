'use client';

import { createActivityRequest } from '@/app/action/activity-request';
import { Button } from '@/components/ui/button';
import formatDateRange from '@/utils/formatDateRange';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface Props {
  startDate: Date;
  endDate: Date;
  maxCount: number;
  activityId: string;
}

export default function PromiseRequestForm({ startDate, endDate, maxCount, activityId }: Props) {
  const [isPending, startTransition] = useTransition();
  const formatDate = formatDateRange({ startDateString: startDate, endDateString: endDate });
  const nowDate = new Date();
  const activityStatus = endDate < nowDate;

  const applyActivity = () => {
    startTransition(async () => {
      const result = await createActivityRequest(activityId);
      toast.message(result.message);
    });
  };

  // 이 부분은 form으로 개선이 필요해 보여서 버튼 적용은 추후에 진행해야 할 듯 합니다.
  return (
    <div className="tall:sticky fixed inset-x-0 bottom-0 w-full tall:max-w-[420px] h-20 bg-[#1B1B1B] z-50 flex justify-between gap-8 items-center px-8 py-0">
      <div className="flex flex-col items-center justify-between w-full gap-2">
        <p className="text-sm text-white">최대 인원 {maxCount}명</p>
        <p className="text-xs text-white">{formatDate}</p>
      </div>
      <Button
        type="button"
        className="px-4 py-2 text-sm font-semibold text-white border border-none rounded-md bg-primary hover:bg-primary_dark"
        onClick={applyActivity}
        disabled={isPending || activityStatus}
      >
        약속잡기
      </Button>
    </div>
  );
}
