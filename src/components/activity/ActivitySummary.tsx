import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { ActivityItem, ActivityResponse } from '@/api/types/activityTypes';

import ActivitySingle from './ActivitySingle';

type Props = {
  allActivity?: boolean;
  pageNumber?: number;
  activity?: ActivityResponse;
  fetching?: boolean;
};

const ActivitySummary = ({
  activity,
  allActivity,
  pageNumber,
  fetching,
}: Props) => {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useMemo(() => {
    if (activity) {
      setActivityItems(activity.activityItems);
      setTotalPages(activity.totalPages);
    }
  }, [activity]);

  useEffect(() => {
    if (!allActivity && activityItems.length > 8) {
      setActivityItems(activityItems.slice(0, 8));
    }
  }, [allActivity, activityItems]);

  const getPageNumbers = (allPages: number) => {
    const currentPage = pageNumber || 1;
    let startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(startPage + 9, allPages);

    if (endPage - startPage < 9) {
      startPage = Math.max(endPage - 9, 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );

    return pages;
  };

  if (fetching) {
    return (
      <div className="mt-3 flex flex-col">
        <div className="mt-2">
          <Skeleton count={8} height={145} className="mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col">
      {activityItems && activityItems.length > 0 && (
        <div className="mt-2">
          {activityItems.map((activityItem) => (
            <ActivitySingle
              key={activityItem.transactionHash}
              activityItem={activityItem}
            />
          ))}
          {!allActivity || !pageNumber ? (
            <div className="mt-4 flex w-full flex-row items-center justify-end">
              <Link
                href="/activity/1"
                className="rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
              >
                View All
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center">
              {/* Render the previous button */}
              {pageNumber > 1 && (
                <Link
                  href="/activity/[pageNumber]"
                  as={`/activity/${pageNumber - 1}`}
                  className="next-or-prev mr-1 rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                >
                  Previous
                </Link>
              )}

              {/* Render the pagination numbers */}
              <ul className="flex">
                {getPageNumbers(totalPages).map((thisPage) => (
                  <li key={thisPage} className="mx-1">
                    <Link
                      href="/activity/[page]"
                      as={`/activity/${thisPage}`}
                      className="rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                    >
                      {thisPage}
                    </Link>
                  </li>
                ))}
                {totalPages > 10 && pageNumber !== totalPages && (
                  <li className="mx-1">...</li>
                )}
                {totalPages > 10 && pageNumber !== totalPages && (
                  <li key={pageNumber} className="mx-1">
                    <Link
                      href="/activity/[page]"
                      as={`/activity/${totalPages}`}
                      className="rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                    >
                      {totalPages}
                    </Link>
                  </li>
                )}
              </ul>

              {/* Render the next button */}
              {pageNumber < totalPages && (
                <Link
                  href="/activity/[pageNumber]"
                  as={`/activity/${pageNumber + 1}`}
                  className="next-or-prev ml-1 rounded border border-blue-200 bg-blue-200 px-4 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                >
                  Next
                </Link>
              )}
              {pageNumber === totalPages && (
                <Link
                  href="/activity/1"
                  className="next-or-prev ml-1 rounded border border-blue-200 bg-blue-200 px-4 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                >
                  First
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;
