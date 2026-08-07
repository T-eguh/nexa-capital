import React, { useState } from 'react';
import { AdminLayout, AdminTabType } from './admin/AdminLayout';
import { AdminDashboardOverview } from './admin/AdminDashboardOverview';
import { UserManagementView } from './admin/UserManagementView';
import { RoleManagementView } from './admin/RoleManagementView';
import { ProductManagementView } from './admin/ProductManagementView';
import { InvestmentManagementView } from './admin/InvestmentManagementView';
import { DepositQueueView } from './admin/DepositQueueView';
import { WithdrawalQueueView } from './admin/WithdrawalQueueView';
import { WalletManagementView } from './admin/WalletManagementView';
import { ReferralManagementView } from './admin/ReferralManagementView';
import { CMSManagementView } from './admin/CMSManagementView';
import { AnnouncementManagementView } from './admin/AnnouncementManagementView';
import { BroadcastNotificationView } from './admin/BroadcastNotificationView';
import { SupportTicketView } from './admin/SupportTicketView';
import { AuditSystemLogsView } from './admin/AuditSystemLogsView';
import { SystemSettingsView } from './admin/SystemSettingsView';
import { FileManagerView } from './admin/FileManagerView';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboardOverview />;
      case 'users':
        return <UserManagementView />;
      case 'roles':
        return <RoleManagementView />;
      case 'products':
        return <ProductManagementView />;
      case 'investments':
        return <InvestmentManagementView />;
      case 'deposits':
        return <DepositQueueView />;
      case 'withdrawals':
        return <WithdrawalQueueView />;
      case 'wallets':
        return <WalletManagementView />;
      case 'referrals':
        return <ReferralManagementView />;
      case 'cms':
        return <CMSManagementView />;
      case 'announcements':
        return <AnnouncementManagementView />;
      case 'broadcast':
        return <BroadcastNotificationView />;
      case 'tickets':
        return <SupportTicketView />;
      case 'logs':
        return <AuditSystemLogsView />;
      case 'settings':
        return <SystemSettingsView />;
      case 'files':
        return <FileManagerView />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTabContent()}
    </AdminLayout>
  );
};
