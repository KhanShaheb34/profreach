"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./profile-form";
import { ResumeUpload } from "./resume-upload";
import { DocumentManager } from "./document-manager";
import { SmartMemory } from "./smart-memory";

export function ProfileContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your academic profile, documents, and AI memory
        </p>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="memory">Smart Memory</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <ResumeUpload />
          <ProfileForm />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentManager />
        </TabsContent>

        <TabsContent value="memory">
          <SmartMemory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
