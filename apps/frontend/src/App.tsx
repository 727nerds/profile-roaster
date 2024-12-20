// submitter and frontend made partially with help of v0
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validLanguages } from './lib/validLanguages';
import RoastDialog from './components/app/RoastDialog';
import Turnstile, { useTurnstile } from 'react-turnstile';
import { toast } from 'sonner';
import { Github } from 'lucide-react';

export default function Component() {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('english');
  const [ruleset, setRuleset] = useState('osu');
  const [roastDialogClose, setRoastDialogClose] = useState(false);
  const [mockingMessage, setMockingMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const turnstile = useTurnstile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const form = new FormData();
    form.append('language', language);
    form.append('ruleset', ruleset);
    form.append('turnstile', turnstileToken);

    const request = await fetch(
      `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''}/roast/${username}`,
      { method: 'POST', body: form }
    );
    if (!request.ok && request.status === 429) {
      toast.error('The text is already being generated or you are ratelimited. Please wait a few seconds and try again.');
      setLoading(false);
      turnstile.reset();
      return;
    }
    if (!request.ok) {
      toast.error('An error occurred while mocking your profile. Check the console for more info.');
      console.error(await request.text());
      setLoading(false);
      turnstile.reset();
      return;
    }

    const text = await request.text();
    setMockingMessage(text);
    setLoading(false);
    turnstile.reset();
  };

  React.useEffect(() => {
    if (roastDialogClose) {
      setMockingMessage('');
      setRoastDialogClose(false);
    }
  }, [roastDialogClose]);
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#ff66ab] via-[#b48def] to-[#8662c7] animate-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>osu! profile roaster</CardTitle>
            <CardDescription>Let AI roast your osu! profile!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {validLanguages.map((lang) => {
                      return <SelectItem value={lang}>{lang}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruleset">Ruleset</Label>
                <Select value={ruleset} onValueChange={setRuleset} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ruleset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="osu">std</SelectItem>
                    <SelectItem value="fruits">catch</SelectItem>
                    <SelectItem value="taiko">taiko</SelectItem>
                    <SelectItem value="mania">mania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex justify-center">
                <Input type='hidden' name='turnstile' value={turnstileToken} required />
                <Turnstile
                  sitekey={process.env.NODE_ENV === 'development' ? '1x00000000000000000000AA' : '0x4AAAAAAAzRJjmxRtCjQZGo'}
                  theme="light"
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                  }}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Mock Me!
              </Button>
            </form>
          </CardContent>
          {mockingMessage && !roastDialogClose && <RoastDialog roast={mockingMessage} close={setRoastDialogClose} />}
        </Card>
      </div>
      <div className="fixed bottom-2 right-2 bg-white p-2 rounded-md text-sm">
        <div className="flex items-center mb-2">
          Submission #1 for{' '}
          <a href="https://highseas.hackclub.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors ml-1">
            Hackclub High Seas
          </a>{'. '}
          Now using 4o-mini.
        </div>
        <div className="flex items-center mb-2">
          Made by{' '}
          <a href="https://srizan.dev" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors ml-1">
            Sr Izan
          </a>
          , inspired by{' '}
          <a href="https://github-roast.pages.dev/" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors ml-1">
            GitHub Profile Roast
          </a>
          <a href="https://github.com/727nerds/profile-roaster" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors ml-1">
            <Github />
          </a>
        </div>
      </div>
    </>
  );
}
