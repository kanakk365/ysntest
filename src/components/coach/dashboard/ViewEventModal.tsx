import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Event as ApiEvent } from '@/lib/api';

interface EventData {
  id?: string | number;
  event_id?: string | number;
  title?: string;
  event_name?: string;
  start?: string;
  end?: string;
  description?: string;
  location?: string;
  isRecurring?: boolean;
  isAllDay?: boolean;
  originalEvent?: ApiEvent;
  [key: string]: unknown;
}

interface ViewEventModalProps {
  open: boolean;
  onClose: () => void;
  eventData: EventData;
  handleDelete: (eventId: string | number) => void;
  handleEdit: (eventData: EventData) => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  open,
  onClose,
  eventData,
  handleDelete,
  handleEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    location: '',
    isRecur: false,
    isAllDay: false,
  });

  // Initialize edit form when eventData changes
  React.useEffect(() => {
    if (eventData) {
      const formatDateTimeForInput = (dateString: string) => {
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          
          // Format as YYYY-MM-DDTHH:MM for datetime-local input
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
          console.error('Error formatting date:', dateString, error);
          return '';
        }
      };

      setEditForm({
        title: eventData.title || eventData.event_name || '',
        start: eventData.start ? formatDateTimeForInput(eventData.start) : '',
        end: eventData.end ? formatDateTimeForInput(eventData.end) : '',
        description: eventData.description || '',
        location: eventData.location || '',
        isRecur: eventData.isRecurring || false,
        isAllDay: eventData.isAllDay || false,
      });
    }
  }, [eventData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Validate required fields
    if (!editForm.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (!editForm.start || !editForm.end) {
      alert('Please enter both start and end dates');
      return;
    }

    // Validate that end date is after start date
    const startDate = new Date(editForm.start);
    const endDate = new Date(editForm.end);
    
    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    // Create updated event data, preserving the originalEvent property
    const updatedEventData = {
      ...eventData,
      title: editForm.title.trim(),
      start: editForm.start,
      end: editForm.end,
      description: editForm.description.trim(),
      location: editForm.location.trim(),
      isRecurring: editForm.isRecur,
      isAllDay: editForm.isAllDay,
      // Preserve the originalEvent property which is needed for the API call
      originalEvent: eventData.originalEvent,
    };

    // Call the handleEdit function with updated data
    handleEdit(updatedEventData);
    setIsEditing(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (eventData) {
      const formatDateTimeForInput = (dateString: string) => {
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          
          // Format as YYYY-MM-DDTHH:MM for datetime-local input
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
          console.error('Error formatting date:', dateString, error);
          return '';
        }
      };

      setEditForm({
        title: eventData.title || eventData.event_name || '',
        start: eventData.start ? formatDateTimeForInput(eventData.start) : '',
        end: eventData.end ? formatDateTimeForInput(eventData.end) : '',
        description: eventData.description || '',
        location: eventData.location || '',
        isRecur: eventData.isRecurring || false,
        isAllDay: eventData.isAllDay || false,
      });
    }
  };

  if (!eventData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Event' : (eventData.title || eventData.event_name || 'Event Details')}
          </DialogTitle>
        </DialogHeader>
        
        {isEditing ? (
          // Edit Form
          <div className="space-y-4">
            <div>
             
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-2'>
                <Label htmlFor="edit-start" className='pl-1'>Start Date & Time</Label>
                <Input
                  id="edit-start"
                  type="datetime-local"
                  value={editForm.start}
                  onChange={(e) => setEditForm({...editForm, start: e.target.value})}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="edit-end" className='pl-1'>End Date & Time</Label>
                <Input
                  id="edit-end"
                  type="datetime-local"
                  value={editForm.end}
                  onChange={(e) => setEditForm({...editForm, end: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecur"
                  checked={editForm.isRecur}
                  onChange={(e) => setEditForm({...editForm, isRecur: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isRecur">Recurring Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAllDay"
                  checked={editForm.isAllDay}
                  onChange={(e) => setEditForm({...editForm, isAllDay: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isAllDay">All Day Event</Label>
              </div>
            </div>
            <div>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Enter event description"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!editForm.title || !editForm.start || !editForm.end}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            {eventData.start && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Start Date</h4>
                <p className="text-sm">{new Date(eventData.start).toLocaleDateString()}</p>
              </div>
            )}
            {eventData.end && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">End Date</h4>
                <p className="text-sm">{new Date(eventData.end).toLocaleDateString()}</p>
              </div>
            )}
            {eventData.description && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                <p className="text-sm">{eventData.description}</p>
              </div>
            )}
            {eventData.location && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                <p className="text-sm">{eventData.location}</p>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const eventId = eventData.id || eventData.event_id;
                  if (eventId) {
                    handleDelete(eventId);
                    onClose();
                  }
                }}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventModal; 