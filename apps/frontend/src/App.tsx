// submitter and frontend made partially with help of v0
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Language, validLanguages } from './lib/validLanguages'
import RoastDialog from './components/app/RoastDialog'

export default function Component() {
  const [username, setUsername] = useState('')
  const [language, setLanguage] = useState('english')
  const [ruleset, setRuleset] = useState('osu')
  const [roastDialogClose, setRoastDialogClose] = useState(false)
  const [mockingMessage, setMockingMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    form.append('language', language)
    form.append('ruleset', ruleset)
    console.log('hi')
    const message = await (await fetch(`https://3000-727nerds-profileroaster-afzq961aypg.ws-eu116.gitpod.io/roast/${username}`, { method: 'POST', body: form })).text()
    setMockingMessage(message)
  }

  React.useEffect(() => {
    if (roastDialogClose) {
      setMockingMessage('')
      setRoastDialogClose(false)
    }
  }, [roastDialogClose])
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>osu! profile roaster</CardTitle>
          <CardDescription>Let AI roast your osu! profile!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {validLanguages.map(lang => {
                    return <SelectItem value={lang}>{lang}</SelectItem>
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
            <Button type="submit" className="w-full">Mock Me!</Button>
          </form>
        </CardContent>
        {mockingMessage && !roastDialogClose && <RoastDialog roast={mockingMessage} close={setRoastDialogClose} />}
      </Card>
    </div>
  )
}