
"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import type { StoredOrderDetails } from "@/contexts/app-context";
import { useEffect } from "react";

const formSchema = z.object({
    type: z.enum(['order', 'voting'], { required_error: "Musisz wybrać typ wydarzenia."}),
    companyName: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
    creatorPhoneNumber: z.string().min(5, "Proszę wprowadzić prawidłowy numer telefonu.").optional().or(z.literal('')),
    imageUrl: z.string().url("Proszę wprowadzić prawidłowy adres URL obrazu.").optional().or(z.literal('')),
    deadline: z.string().optional(),
    votingOptions: z.array(z.object({
        name: z.string().min(1, "Nazwa firmy jest wymagana."),
        link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
        imageUrl: z.string().url("Wymagany jest prawidłowy adres URL obrazu.").optional().or(z.literal(''))
    })).min(1, "Musisz podać co najmniej jedną opcję do głosowania.").optional()
});

type FoodOrderFormProps = {
    onSubmit: (data: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link?: string, imageUrl?: string }[] }) => void;
    onCancel: () => void;
    storedDetails?: StoredOrderDetails | null;
};

export default function FoodOrderForm({ onSubmit, onCancel, storedDetails }: FoodOrderFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "order",
            companyName: "",
            description: "",
            link: storedDetails?.link || "",
            creatorPhoneNumber: storedDetails?.creatorPhoneNumber || "",
            imageUrl: storedDetails?.imageUrl || "",
            deadline: "",
            votingOptions: [{ name: '', link: '', imageUrl: '' }],
        },
    });
    
    useEffect(() => {
        if (storedDetails) {
            form.reset({
                ...form.getValues(),
                link: storedDetails.link,
                creatorPhoneNumber: storedDetails.creatorPhoneNumber,
                imageUrl: storedDetails.imageUrl,
            });
        }
    }, [storedDetails, form]);


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "votingOptions"
    });

    const eventType = form.watch("type");

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const deadlineDate = values.deadline ? new Date() : undefined;
        if (deadlineDate && values.deadline) {
            const [hours, minutes] = values.deadline.split(':').map(Number);
            deadlineDate.setHours(hours, minutes, 0, 0);
        }

        const dataToSubmit = {
            ...values,
            deadline: deadlineDate?.toISOString()
        };

        if (values.type === 'order') {
            const { votingOptions, ...orderData } = dataToSubmit;
            onSubmit(orderData);
        } else {
             const { link, creatorPhoneNumber, imageUrl, ...votingData } = dataToSubmit;
             onSubmit(votingData);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <ScrollArea className="max-h-[70vh] p-4 -m-4">
                 <div className="space-y-6 p-1">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Typ wydarzenia</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="order" /></FormControl>
                                            <FormLabel className="font-normal">Bezpośrednie zamówienie</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="voting" /></FormControl>
                                            <FormLabel className="font-normal">Głosowanie na restaurację</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="companyName" // Used as a title for both
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{eventType === 'order' ? 'Nazwa firmy/restauracji' : 'Tytuł głosowania'}</FormLabel>
                                <FormControl><Input placeholder={eventType === 'order' ? 'np. Pizzeria "Szybka Pizza"' : 'np. Piątkowy lunch'} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Czas zakończenia (opcjonalnie)</FormLabel>
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormDescription>
                                    {eventType === 'order' ? 'Po tym czasie nie będzie można dodawać nowych zamówień.' : 'Po tym czasie głosowanie zostanie zamknięte.'}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {eventType === 'order' ? (
                        <>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opis (opcjonalnie)</FormLabel>
                                        <FormControl><Textarea placeholder="np. instrukcje organizacyjne, numer BLIK do płatności, informacje o zamówieniu" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link do menu</FormLabel>
                                        <FormControl><Input placeholder="https://przykladowapizza.com/menu" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="creatorPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twój numer telefonu</FormLabel>
                                        <FormControl><Input placeholder="Do koordynacji płatności" {...field} /></FormControl>
                                        <FormDescription>Twój numer będzie widoczny dla innych w tym zamówieniu.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL logo/obrazka (opcjonalnie)</FormLabel>
                                        <FormControl><Input placeholder="https://przyklad.com/logo.png" {...field} /></FormControl>
                                        <FormDescription>Bezpośredni link do obrazka z logo firmy.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opis głosowania (opcjonalnie)</FormLabel>
                                        <FormControl><Textarea placeholder="np. instrukcje organizacyjne, zasady głosowania" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <FormLabel>Opcje do głosowania</FormLabel>
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', link: '', imageUrl: '' })}>
                                        <PlusCircle className="mr-2" /> Dodaj opcję
                                    </Button>
                                </div>
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {fields.map((field, index) => (
                                            <CarouselItem key={field.id}>
                                                <Card className="p-4 space-y-3 relative w-full whitespace-normal bg-secondary">
                                                    <h4 className="font-semibold">Opcja {index + 1}</h4>
                                                    <FormField
                                                        control={form.control}
                                                        name={`votingOptions.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Nazwa</FormLabel>
                                                                <FormControl><Input placeholder="np. Sushi World" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`votingOptions.${index}.link`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Link do menu (opcjonalnie)</FormLabel>
                                                                <FormControl><Input placeholder="https://sushiworld.com/menu" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`votingOptions.${index}.imageUrl`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">URL obrazka (opcjonalnie)</FormLabel>
                                                                <FormControl><Input placeholder="https://sushiworld.com/logo.png" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {fields.length > 1 && (
                                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:bg-accent/20 hover:text-accent" onClick={() => remove(index)}>
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                                <FormField
                                    control={form.control}
                                    name="votingOptions"
                                    render={() => (
                                        <FormItem>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}
                 </div>
                </ScrollArea>

                <Separator />
                <div className="flex justify-end gap-2 p-4 -m-4 mt-0">
                    <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" className="btn-gradient">
                        Utwórz wydarzenie
                    </Button>
                </div>
            </form>
        </Form>
    );
}
