"use client";

import { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, Clock } from 'lucide-react';
import { getWeek } from 'date-fns';

export default function WeeklyStatus() {
  const { user, weeklyStatus, updateWeeklyStatus, showStatusPrompt } = useContext(AppContext);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (weeklyStatus) {
      setStatusText(weeklyStatus.content);
    }
  }, [weeklyStatus]);

  const handleSave = () => {
    updateWeeklyStatus(statusText, 'draft');
  };

  const handlePublish = () => {
    updateWeeklyStatus(statusText, 'published');
  };

  if (!showStatusPrompt || !user) {
    return null;
  }

  const isPublished = weeklyStatus?.status === 'published';
  const weekNumber = getWeek(new Date(), { weekStartsOn: 1 });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Weekly Status - Week {weekNumber}</CardTitle>
        <CardDescription>
          {isPublished 
            ? "Your status for this week has been published."
            : "Share your progress and learnings from this week. You can edit until Friday 18:00."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPublished ? (
           <Alert variant="default" className="bg-green-50 border-green-200">
             <CheckCircle className="h-4 w-4 !text-green-600" />
             <AlertTitle className="text-green-800">Status Published!</AlertTitle>
             <AlertDescription className="text-green-700">
                Your status has been added to your portfolio. You can still edit or expand on it from your profile.
             </AlertDescription>
           </Alert>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Your status will be automatically published on Friday at 18:00. If you leave it empty, a default "No status for this week" will be posted.
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="What did you work on this week? What did you learn?"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="min-h-[120px]"
              disabled={isPublished}
            />
          </div>
        )}
      </CardContent>
      {!isPublished && (
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Clock className="mr-2" /> Save Draft
            </Button>
            <Button onClick={handlePublish}>
              <CheckCircle className="mr-2" /> Publish Now
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
