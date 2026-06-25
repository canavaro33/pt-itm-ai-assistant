'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProfileCard from '@/components/profile/ProfileCard';
import SettingsPanel from '@/components/profile/SettingsPanel';
import EditProfileModal from '@/components/profile/EditProfileModal';
import CertificationsModal from '@/components/profile/CertificationsModal';
import WorkLocationModal from '@/components/profile/WorkLocationModal';
import SecurityModal from '@/components/profile/SecurityModal';
import NotificationModal from '@/components/profile/NotificationModal';

export default function ProfilePage() {
  const { user } = useAuth();

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [isWorkLocationOpen, setIsWorkLocationOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-accent border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400 text-sm lg:text-base">Manage your account settings and preferences</p>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Profile Identity (35%) */}
        <div className="w-full lg:w-[35%]">
          <ProfileCard user={user} onEditClick={() => setIsEditModalOpen(true)} />
        </div>

        {/* Right Column - Settings & Information (65%) */}
        <div className="w-full lg:w-[65%]">
          <SettingsPanel
            user={user}
            onEditClick={() => setIsEditModalOpen(true)}
            onCertificationsClick={() => setIsCertificationsOpen(true)}
            onWorkLocationClick={() => setIsWorkLocationOpen(true)}
            onSecurityClick={() => setIsSecurityOpen(true)}
            onNotificationsClick={() => setIsNotificationsOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
      <CertificationsModal
        isOpen={isCertificationsOpen}
        onClose={() => setIsCertificationsOpen(false)}
      />
      <WorkLocationModal
        isOpen={isWorkLocationOpen}
        onClose={() => setIsWorkLocationOpen(false)}
      />
      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
