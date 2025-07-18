"use client";

import { useState, useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import type { PortfolioItem } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { FileText, Link, PlusCircle, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import PortfolioItemForm from './portfolio-item-form';

export default function PortfolioSection() {
    const { user, portfolio, upsertPortfolioItem, removePortfolioItem, togglePortfolioItemVisibility } = useContext(AppContext);
    const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);

    if (!user) return null;

    const sortedPortfolio = portfolio.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const statuses = sortedPortfolio.filter(item => item.type === 'status');
    const projects = sortedPortfolio.filter(item => item.type === 'project');

    const handleEdit = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(undefined);
        setIsFormOpen(true);
    }
    
    const handleFormSubmit = (item: PortfolioItem) => {
        upsertPortfolioItem(item);
        setIsFormOpen(false);
        setEditingItem(undefined);
    }

    const renderItem = (item: PortfolioItem) => (
        <Card key={item.id} className="flex flex-col">
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
                        <CardDescription>
                            {item.type === 'status' && `Status for week of ${format(parseISO(item.weekOf!), 'MMMM d, yyyy')}`}
                            {item.type === 'project' && `Added on ${format(parseISO(item.date), 'MMMM d, yyyy')}`}
                        </CardDescription>
                    </div>
                    <Badge variant={item.type === 'status' ? 'secondary' : 'default'}>{item.type}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                 {item.technologies && item.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {item.technologies.map(tech => <Badge key={tech} variant="outline">{tech}</Badge>)}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <div>
                    {item.link && (
                        <Button variant="link" asChild className="p-0 h-auto">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                               <Link className="mr-2" /> View Link
                            </a>
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => togglePortfolioItemVisibility(item.id)}>
                        {item.isVisible ? <Eye /> : <EyeOff />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil /></Button>
                    <Button variant="ghost" size="icon" onClick={() => removePortfolioItem(item.id)}><Trash2 /></Button>
                </div>
            </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Portfolio</h3>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Project" : "Add New Project"}</DialogTitle>
                        </DialogHeader>
                        <PortfolioItemForm
                          item={editingItem}
                          onSubmit={handleFormSubmit}
                          onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Projects */}
            <div className="space-y-2">
                <h4 className="text-lg font-semibold font-headline">Projects</h4>
                 {projects.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {projects.map(renderItem)}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No projects added yet.</p>
                )}
            </div>

            {/* Weekly Statuses */}
            <div className="space-y-2">
                <h4 className="text-lg font-semibold font-headline">Weekly Statuses</h4>
                {statuses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {statuses.map(renderItem)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium">No Statuses Published</p>
                        <p className="text-sm text-muted-foreground">Your weekly statuses will appear here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
