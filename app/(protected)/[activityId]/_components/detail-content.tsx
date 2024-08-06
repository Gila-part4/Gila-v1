/* eslint-disable no-underscore-dangle */
import DetailTitle from '@/app/(protected)/[activityId]/_components/detail-title';
import DetailDescription from '@/app/(protected)/[activityId]/_components/detail-description';
import { ActivityWithUserAndFavorite } from '@/type';
import DetailCarousel from '@/app/(protected)/[activityId]/_components/detail-carousel';
import AuthorInfo from '@/app/(protected)/[activityId]/_components/author-info';

export default function DetailContent({ detail }: { detail: ActivityWithUserAndFavorite }) {
  return (
    <div>
      <DetailCarousel thumbnails={detail.thumbnails} />
      <div className="flex flex-col gap-6 m-4">
        <DetailTitle activityDetail={detail} />
        <DetailDescription description={detail.description} locations={detail.location} />
        <AuthorInfo ownerId={detail.userId} />
      </div>
    </div>
  );
}
