import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Separator } from '../components/ui/Separator';
import { Switch } from '../components/ui/Switch';
import { AlertTriangle, Calendar, Zap } from 'lucide-react';
import { AFButton, FilterButton, IconTile, SearchBar, SegmentedTabs } from '../components/ui/AFComponents';

export default function ComponentsTestPage() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">UI Components Test Page</h1>
        <p className="text-sm text-muted-foreground">Use this page to quickly preview all shared UI components.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Buttons & Badges</CardTitle>
          <CardDescription>Common actions and status labels.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AF Components (New Set)</CardTitle>
          <CardDescription>Your updated, more app-specific component style.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <AFButton leftIcon={<Calendar className="h-5 w-5" />}>Ny aktivitet</AFButton>
            <AFButton variant="secondary">Sekundær</AFButton>
            <AFButton variant="danger" leftIcon={<AlertTriangle className="h-5 w-5" />}>
              Slett
            </AFButton>
            <AFButton variant="ghost" rightIcon={<Zap className="h-5 w-5" />}>
              Hurtigvalg
            </AFButton>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <IconTile icon={<Calendar className="h-5 w-5" />} color="navy" />
            <IconTile icon={<AlertTriangle className="h-5 w-5" />} color="red" />
            <IconTile icon={<Zap className="h-5 w-5" />} color="light" />
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <SearchBar />
            <FilterButton />
          </div>

          <SegmentedTabs active={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
          <CardDescription>Input, select, checkbox and switch states.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="test-input">Input</label>
            <Input id="test-input" placeholder="Type something..." />
          </div>
          <div className="space-y-2">
            <label htmlFor="test-select">Select</label>
            <Select id="test-select" defaultValue="open">
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="test-checkbox" />
            <label htmlFor="test-checkbox">Checkbox option</label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isSwitchOn} onCheckedChange={setIsSwitchOn} />
            <span>{isSwitchOn ? 'Switch is ON' : 'Switch is OFF'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overlay Components</CardTitle>
          <CardDescription>Dialog and dropdown menu interaction.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>This is a sample dialog for UI testing.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View project</DropdownMenuItem>
              <DropdownMenuItem>Edit project</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Card Layout</CardTitle>
          <CardDescription>Simple card structure preview.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This block lives inside card content.</p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm">Footer Action</Button>
        </CardFooter>
      </Card>
    </main>
  );
}