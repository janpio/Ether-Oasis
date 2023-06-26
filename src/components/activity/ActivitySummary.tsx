// TODO: refactor to add pagination at bottom when allActivity is true, receive page from url params
/* eslint-disable import/no-extraneous-dependencies */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import type { ActivityItem, ActivityResponse } from '@/api/types/activityTypes';

import ActivitySingle from './ActivitySingle';

type Props = {
  allActivity?: boolean;
  pageNumber?: number;
  activity?: ActivityResponse;
};

const ActivitySummary = ({ activity, allActivity, pageNumber }: Props) => {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useMemo(() => {
    if (activity) {
      setActivityItems(activity.activityItems);
      setTotalPages(activity.totalPages);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (!allActivity && activityItems.length > 12) {
      setActivityItems(activityItems.slice(0, 12));
    }
  }, [allActivity, activityItems]);

  const getPageNumbers = (allPages: number) => {
    return Array.from({ length: allPages }, (_, index) => index + 1);
  };

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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;
