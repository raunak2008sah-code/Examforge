'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/admin/layout/PageContainer';
import { SectionCard } from '@/components/admin/containers/SectionCard';
import { Breadcrumb } from '@/components/admin/layout/Breadcrumb';
import { Tabs } from '@/components/ui/navigation/Tabs';

// Component imports
import {
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  SortableHeader,
} from '@/components/ui/tables/Table';
import { Pagination } from '@/components/ui/tables/Pagination';
import { SearchBar, FilterBar, BulkActionBar } from '@/components/ui/tables/TableToolbar';
import { EmptyTableState, LoadingTableSkeleton } from '@/components/ui/tables/TableFeedback';
import { TextInput, PasswordField, NumberField } from '@/components/ui/forms/TextInput';
import { TextArea } from '@/components/ui/forms/TextArea';
import { Select } from '@/components/ui/forms/Select';
import { Checkbox, RadioGroup, ToggleSwitch } from '@/components/ui/forms/Checkbox';
import { DatePicker, TimePicker, FileUploadField } from '@/components/ui/forms/AdvancedInputs';
import { FormSection, FormActions, ValidationMessage } from '@/components/ui/forms/FormLayout';
import { Alert, Banner } from '@/components/ui/feedback/Alert';
import { ToastContainer } from '@/components/ui/feedback/Toast';
import { ProgressBar, Spinner, InlineLoader } from '@/components/ui/feedback/Loader';
import { Modal } from '@/components/ui/overlays/Modal';
import { Drawer } from '@/components/ui/overlays/Drawer';
import { DropdownMenu } from '@/components/ui/overlays/Dropdown';
import { Tooltip } from '@/components/ui/overlays/Tooltip';
import { Stepper } from '@/components/ui/navigation/Stepper';
import {
  Badge,
  Chip,
  Avatar,
  Divider,
  KeyValueDisplay,
  CopyButton,
} from '@/components/ui/utility/Utilities';
import { CodeBlock } from '@/components/ui/utility/CodeBlock';
import { FormSkeleton, CardSkeleton } from '@/components/ui/skeletons/Skeletons';
import { Settings, User, LogOut, Info } from 'lucide-react';

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<
    {
      id: string;
      title: string;
      message: string;
      variant: 'info' | 'success' | 'warning' | 'error';
    }[]
  >([]);

  const addToast = (variant: 'info' | 'success' | 'warning' | 'error') => {
    setToasts((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        title: `A ${variant} toast!`,
        message: 'This is a message.',
        variant,
      },
    ]);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const TablesTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SectionCard title="Data Table & Toolbar">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}
        >
          <SearchBar value="" onChange={() => {}} placeholder="Search exams..." />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <FilterBar onClick={() => {}} />
            <button className="ef-button ef-button-primary">Create New</button>
          </div>
        </div>

        <BulkActionBar selectedCount={2} onClear={() => {}} onDelete={() => {}} />

        <div style={{ marginTop: 'var(--space-4)' }}>
          <DataTable>
            <TableHeader>
              <TableCell isHeader width="40px">
                <input type="checkbox" checked readOnly />
              </TableCell>
              <SortableHeader
                label="Name"
                sortKey="name"
                currentSort="name"
                direction="asc"
                onSort={() => {}}
              />
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader align="right">
                Actions
              </TableCell>
            </TableHeader>
            <TableBody>
              <TableRow isSelected>
                <TableCell>
                  <input type="checkbox" checked readOnly />
                </TableCell>
                <TableCell>JEE Advanced 2023</TableCell>
                <TableCell>
                  <Badge variant="success">Published</Badge>
                </TableCell>
                <TableCell align="right">
                  <button className="ef-button ef-button-secondary">Edit</button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <input type="checkbox" readOnly />
                </TableCell>
                <TableCell>NEET 2024</TableCell>
                <TableCell>
                  <Badge variant="warning">Draft</Badge>
                </TableCell>
                <TableCell align="right">
                  <button className="ef-button ef-button-secondary">Edit</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </DataTable>
          <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
        </div>
      </SectionCard>

      <SectionCard title="Empty State">
        <EmptyTableState title="No exams found" description="Create an exam to get started." />
      </SectionCard>

      <SectionCard title="Loading Skeleton">
        <LoadingTableSkeleton />
      </SectionCard>
    </div>
  );

  const FormsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SectionCard title="Text Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <TextInput
            label="Standard Input"
            placeholder="Enter text..."
            helperText="This is a hint."
          />
          <TextInput label="Error Input" defaultValue="Wrong" error="This field is required." />
          <PasswordField label="Password" />
          <NumberField label="Number" defaultValue={42} />
        </div>
        <TextArea label="Description" placeholder="Enter long text here..." />
      </SectionCard>

      <SectionCard title="Selection Controls">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <Select
              label="Role"
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ]}
            />
            <RadioGroup
              label="Status"
              name="status"
              value="active"
              onChange={() => {}}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>
          <div>
            <Checkbox label="Remember me" description="Save login for 30 days" />
            <Checkbox label="Accept Terms" error="You must accept the terms" />
            <ToggleSwitch label="Enable Notifications" checked readOnly />
            <ToggleSwitch label="Dark Mode" readOnly />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Advanced Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <DatePicker label="Start Date" />
          <TimePicker label="Time" />
        </div>
        <FileUploadField label="Document Upload" />
      </SectionCard>

      <SectionCard title="Form Layout">
        <ValidationMessage message="Please fix the errors before submitting." />
        <FormSection title="Personal Info" description="Basic details about the user.">
          <TextInput label="Full Name" />
        </FormSection>
        <FormActions>
          <button className="ef-button ef-button-secondary">Cancel</button>
          <button className="ef-button ef-button-primary">Save Changes</button>
        </FormActions>
      </SectionCard>
    </div>
  );

  const FeedbackTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SectionCard title="Alerts & Banners">
        <Banner variant="info">System maintenance scheduled for midnight UTC.</Banner>
        <div
          style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <Alert variant="info" title="Information">
            This is an informational alert.
          </Alert>
          <Alert variant="success" title="Success">
            Your changes have been saved successfully.
          </Alert>
          <Alert variant="warning" title="Warning">
            Your session is about to expire.
          </Alert>
          <Alert variant="error" title="Error">
            Failed to process the document.
          </Alert>
        </div>
      </SectionCard>

      <SectionCard title="Loaders">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <ProgressBar progress={65} showLabel />
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <Spinner />
            <Spinner color="var(--state-success)" size={32} />
            <InlineLoader text="Saving draft..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Toasts">
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="ef-button ef-button-secondary" onClick={() => addToast('info')}>
            Info Toast
          </button>
          <button className="ef-button ef-button-secondary" onClick={() => addToast('success')}>
            Success Toast
          </button>
          <button className="ef-button ef-button-secondary" onClick={() => addToast('warning')}>
            Warning Toast
          </button>
          <button className="ef-button ef-button-secondary" onClick={() => addToast('error')}>
            Error Toast
          </button>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </SectionCard>
    </div>
  );

  const OverlaysTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SectionCard title="Modals & Drawers">
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <button className="ef-button ef-button-primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </button>
          <button className="ef-button ef-button-secondary" onClick={() => setDrawerOpen(true)}>
            Open Drawer
          </button>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit Configuration"
          footer={
            <>
              <button className="ef-button ef-button-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="ef-button ef-button-primary" onClick={() => setModalOpen(false)}>
                Save
              </button>
            </>
          }
        >
          <p>Make changes to your configuration here. Click save when you are done.</p>
          <TextInput label="Setting Value" defaultValue="42" />
        </Modal>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Details Panel"
          footer={
            <button className="ef-button ef-button-primary" onClick={() => setDrawerOpen(false)}>
              Close
            </button>
          }
        >
          <p>Drawer content goes here. It slides in from the right edge of the screen.</p>
        </Drawer>
      </SectionCard>

      <SectionCard title="Dropdowns & Tooltips">
        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
          <DropdownMenu
            trigger={<button className="ef-button ef-button-secondary">Actions ▼</button>}
            items={[
              { label: 'Profile', icon: <User size={16} /> },
              { label: 'Settings', icon: <Settings size={16} /> },
              { label: 'DIVIDER' },
              { label: 'Log out', icon: <LogOut size={16} />, danger: true },
            ]}
          />

          <Tooltip content="This is a helpful tip!">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                color: 'var(--text-secondary)',
              }}
            >
              <Info size={16} /> Hover me
            </div>
          </Tooltip>
        </div>
      </SectionCard>
    </div>
  );

  const UtilitiesTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <SectionCard title="Badges & Chips">
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Chip>React</Chip>
          <Chip onRemove={() => {}}>TypeScript</Chip>
          <Chip onRemove={() => {}}>Next.js</Chip>
        </div>
      </SectionCard>

      <SectionCard title="Data Display">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Avatar initials="JD" />
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
          <KeyValueDisplay label="API Key" value="sk_test_123456789" />
          <CopyButton text="sk_test_123456789" />
        </div>
        <Divider />
        <CodeBlock
          language="json"
          code={`{\n  "name": "ExamForge",\n  "version": "1.0.0",\n  "description": "Assessment platform"\n}`}
        />
      </SectionCard>

      <SectionCard title="Skeletons">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <CardSkeleton />
          <FormSkeleton />
        </div>
      </SectionCard>
    </div>
  );

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Design System', href: '/admin/design-system' },
        ]}
      />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="text-h1">Design System</h1>
        <p className="text-meta">A showcase of all UI components built for the Admin Portal.</p>
      </div>

      <Stepper
        steps={[
          { id: '1', label: 'Setup', description: 'Tokens & CSS' },
          { id: '2', label: 'Components', description: 'Building the library' },
          { id: '3', label: 'Showcase', description: 'Visual verification' },
        ]}
        currentStepId="3"
      />

      <Tabs
        tabs={[
          { id: 'tables', label: 'Tables', content: <TablesTab /> },
          { id: 'forms', label: 'Forms', content: <FormsTab /> },
          { id: 'feedback', label: 'Feedback', content: <FeedbackTab /> },
          { id: 'overlays', label: 'Overlays', content: <OverlaysTab /> },
          { id: 'utilities', label: 'Utilities & Layout', content: <UtilitiesTab /> },
        ]}
      />
    </PageContainer>
  );
}
