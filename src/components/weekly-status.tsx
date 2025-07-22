
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
    <Card className="w-full border-green-200">
      <CardHeader className="bg-green-50 rounded-t-lg">
        <CardTitle className="font-headline text-2xl text-green-900">Status tygodniowy - Tydzień {weekNumber}</CardTitle>
        <CardDescription>
          {isPublished 
            ? "Twój status na ten tydzień został opublikowany."
            : "Podziel się postępami i tym, czego nauczyłeś/aś się w tym tygodniu. Możesz edytować wpis do piątku o 18:00."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPublished ? (
           <Alert variant="default" className="bg-green-100 border-green-300">
             <CheckCircle className="h-4 w-4 !text-green-600" />
             <AlertTitle className="text-green-800">Status opublikowany!</AlertTitle>
             <AlertDescription className="text-green-700">
                Twój status został dodany do Twojego portfolio. Nadal możesz go edytować lub rozszerzać z poziomu swojego profilu.
             </AlertDescription>
           </Alert>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Uwaga!</AlertTitle>
              <AlertDescription>
                Twój status zostanie automatycznie opublikowany w piątek o 18:00. Jeśli go nie uzupełnisz, zostanie opublikowany domyślny wpis "Brak statusu na ten tydzień".
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Nad czym pracowałeś/aś w tym tygodniu? Czego się nauczyłeś/aś?"
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
              <Clock className="mr-2" /> Zapisz wersję roboczą
            </Button>
            <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2" /> Opublikuj teraz
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
