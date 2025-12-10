/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { useState } from 'react';

import { useModal } from '@/hooks';
import {
  ChangeNameForm,
  ChangePasswordForm,
  Modal,
  PageLayout,
  UpdatePhoneForm,
} from '@/shared/components';
import { useGlobalStore } from '@/store/globalStore';

type SettingsPageProps = {};
export default function Settings() {
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [activeModal, setActiveModal] = useState<'name' | 'password' | 'phone' | null>(null);
  
  const nameModal = useModal();
  const passwordModal = useModal();
  const phoneModal = useModal();

  const handleOpenNameModal = () => {
    setActiveModal('name');
    nameModal.open();
  };

  const handleOpenPasswordModal = () => {
    setActiveModal('password');
    passwordModal.open();
  };

  const handleOpenPhoneModal = () => {
    setActiveModal('phone');
    phoneModal.open();
  };

  const handleCloseModal = () => {
    nameModal.close();
    passwordModal.close();
    phoneModal.close();
    setActiveModal(null);
  };

  const handleSuccess = async () => {
    // Refresh user info từ Supabase
    const { supabase } = await import('@/shared/lib/config/supabaseClient');
    const { data: sessionData } = await supabase.auth.getSession();
    const setUserInfo = useGlobalStore.getState().setUserInfo;
    
    if (sessionData.session?.user) {
      const user = sessionData.session.user;
      setUserInfo({
        email: user.email ?? "",
        fullName:
          (user.user_metadata?.fullName as string) ??
          `${user.user_metadata?.firstName ?? ""} ${user.user_metadata?.lastName ?? ""}`.trim(),
        phone: user.phone || user.user_metadata?.phone,
        photoUrl: user.user_metadata?.avatar_url,
        id: undefined,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at ?? user.last_sign_in_at ?? user.created_at),
        isDeleted: false,
      });
    }
  };

  return (
    <PageLayout title="Settings">
      <div className="flex md:flex-row flex-col gap-10 bg-white shadow-md p-6 rounded-lg">
        <div className="flex flex-col flex-1 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Full name
            </label>
            <div>{userInfo?.fullName ?? "-"}</div>
            <div 
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={handleOpenNameModal}
            >
              Change Name
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Email
            </label>
            <div>{userInfo?.email ?? "-"}</div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Phone
            </label>
            <div>{userInfo?.phone ?? "-"}</div>
            <div 
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={handleOpenPhoneModal}
            >
              Update Phone
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Password
            </label>
            <div>*********</div>
            <div 
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={handleOpenPasswordModal}
            >
              Change Password
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi tên */}
      <Modal
        isOpen={nameModal.isOpen}
        onClose={handleCloseModal}
        title="Đổi tên"
      >
        <ChangeNameForm
          modal={nameModal}
          onSuccess={handleSuccess}
          currentName={userInfo?.fullName ?? ""}
        />
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        isOpen={passwordModal.isOpen}
        onClose={handleCloseModal}
        title="Đổi mật khẩu"
      >
        <ChangePasswordForm
          modal={passwordModal}
          onSuccess={handleSuccess}
        />
      </Modal>

      {/* Modal cập nhật số điện thoại */}
      <Modal
        isOpen={phoneModal.isOpen}
        onClose={handleCloseModal}
        title="Cập nhật số điện thoại"
      >
        <UpdatePhoneForm
          modal={phoneModal}
          onSuccess={handleSuccess}
          currentPhone={userInfo?.phone ?? ""}
        />
      </Modal>
    </PageLayout>
  );
}
