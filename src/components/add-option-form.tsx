
"use client";

import { useState, useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddOptionFormProps = {
    eventId: string;
    onAdded: () => void;
};

export default function AddOptionForm({ eventId, onAdded }: AddOptionFormProps) {
    const { addVotingOption } = useContext(AppContext);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            addVotingOption(eventId, { name, link });
            onAdded();
            setName('');
            setLink('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="option-name">Nazwa firmy</Label>
                <Input id="option-name" value={name} onChange={e => setName(e.target.value)} required placeholder="np. Burger King"/>
            </div>
            <div>
                <Label htmlFor="option-link">Link do menu (opcjonalnie)</Label>
                <Input id="option-link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com/menu"/>
            </div>
            <Button type="submit" variant="glass" className="w-full">Dodaj opcję</Button>
        </form>
    );
}
