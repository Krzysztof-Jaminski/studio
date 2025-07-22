
"use client";

import { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, Clock } from 'lucide-react';
import { differenceInWeeks, startOfWeek } from 'date-fns';

const INTERNSHIP_START_DATE = new Date('2025-07-07');

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
  const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekNumber = differenceInWeeks(startOfThisWeek, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;

  return (
    <Card className="w-full border-green-500/30 bg-card">
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-2xl text-green-400">Weekly Status - Week {weekNumber}</CardTitle>
        <CardDescription>
          {isPublished 
            ? "Your status for this week has been published."
            : "Share your progress and what you've learned this week. You can edit this entry until Friday at 6:00 PM."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isPublished ? (
           <Alert variant="default" className="bg-green-500/10 border-green-500/30">
             <CheckCircle className="h-4 w-4 !text-green-400" />
             <AlertTitle className="text-green-300">Status Published!</AlertTitle>
             <AlertDescription className="text-green-400/80">
                Your status has been added to your portfolio. You can still edit or expand it from your profile.
             </AlertDescription>
           </Alert>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-primary/10 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Your status will be automatically published on Friday at 6:00 PM. If you don't fill it out, a default entry "No status for this week" will be published.
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
            <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2" /> Publish Now
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
