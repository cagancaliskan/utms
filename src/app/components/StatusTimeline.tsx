import { TimelineEvent } from '../types';
import { Check, Clock, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface StatusTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: string;
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  intake_verification: 'Intake Verification',
  returned_for_correction: 'Returned for Correction',
  language_evaluation: 'Language Evaluation',
  academic_evaluation: 'Academic Evaluation',
  dean_review: "Dean's Review",
  board_review: 'Faculty Board Review',
  approved: 'Approved',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted'
};

export function StatusTimeline({ timeline, currentStatus }: StatusTimelineProps) {
  const allStatuses = [
    'submitted',
    'intake_verification',
    'language_evaluation',
    'academic_evaluation',
    'dean_review',
    'board_review',
    'approved'
  ];

  const completedStatuses = new Set(timeline.map(e => e.status));
  const currentIndex = allStatuses.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-gray-900 mb-6">Application Progress</h3>
      <div className="space-y-4">
        {allStatuses.map((status, index) => {
          const isCompleted = completedStatuses.has(status as any);
          const isCurrent = status === currentStatus;
          const isPending = index > currentIndex;
          const event = timeline.find(e => e.status === status);

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-[#10B981] text-white'
                      : isCurrent
                      ? 'bg-[#C00000] text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                {index < allStatuses.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      isCompleted ? 'bg-[#10B981]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <p className={`${isCurrent ? '' : ''} ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                  {statusLabels[status] || status}
                </p>
                {event && (
                  <div className="text-sm text-gray-500 mt-1">
                    <p>{format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                    {event.actor && <p>By: {event.actor}</p>}
                    {event.note && <p className="text-gray-600 mt-1">{event.note}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
