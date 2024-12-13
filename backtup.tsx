import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
	TrashIcon,
	EditIcon,
} from "lucide-react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Calendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState({});
	const [selectedDay, setSelectedDay] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [newEvent, setNewEvent] = useState({
		name: "",
		startTime: "",
		endTime: "",
		description: "",
	});
	const [editingEventIndex, setEditingEventIndex] = useState(null);

	const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const startOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1
	);
	const endOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	);

	const prevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	const nextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	const addEvent = () => {
		if (
			selectedDay &&
			newEvent.name.trim() &&
			newEvent.startTime &&
			newEvent.endTime
		) {
			const eventKey = `${currentDate.getFullYear()}-${
				currentDate.getMonth() + 1
			}-${selectedDay}`;

			const eventToAdd = {
				name: newEvent.name.trim(),
				startTime: newEvent.startTime,
				endTime: newEvent.endTime,
				description: newEvent.description.trim(),
			};

			if (editingEventIndex !== null) {
				// Update existing event
				const updatedEvents = [...(events[eventKey] || [])];
				updatedEvents[editingEventIndex] = eventToAdd;
				setEvents((prev) => ({
					...prev,
					[eventKey]: updatedEvents,
				}));
				setEditingEventIndex(null);
			} else {
				// Add new event
				setEvents((prev) => ({
					...prev,
					[eventKey]: [...(prev[eventKey] || []), eventToAdd],
				}));
			}

			// Reset new event state
			setNewEvent({
				name: "",
				startTime: "",
				endTime: "",
				description: "",
			});
		}
	};

	const deleteEvent = (eventKey, index) => {
		const updatedEvents = [...(events[eventKey] || [])];
		updatedEvents.splice(index, 1);
		setEvents((prev) => ({
			...prev,
			[eventKey]: updatedEvents,
		}));
	};

	const handleDayClick = (day) => {
		setSelectedDay(day);
		setIsDrawerOpen(true);
	};

	const renderDays = () => {
		const totalDays = endOfMonth.getDate();
		const firstDayIndex = startOfMonth.getDay();
		const days = [];

		// Fill in the empty days before the first day of the current month
		for (let i = 0; i < firstDayIndex; i++) {
			days.push(
				<div
					key={`empty-${i}`}
					className='text-center text-gray-400 bg-gray-100 p-4'></div>
			);
		}

		// Fill in the days of the current month
		for (let day = 1; day <= totalDays; day++) {
			const eventKey = `${currentDate.getFullYear()}-${
				currentDate.getMonth() + 1
			}-${day}`;
			const hasEvents = events[eventKey] && events[eventKey].length > 0;

			days.push(
				<div
					key={day}
					onClick={() => handleDayClick(day)}
					className={`
            text-center p-4 hover:bg-gray-200 cursor-pointer 
            transition-colors border border-gray-200 
            ${hasEvents ? "bg-blue-100" : ""}
          `}>
					{day}
					{hasEvents && (
						<span className='block text-xs text-blue-600'>
							{events[eventKey].length} event
							{events[eventKey].length > 1 ? "s" : ""}
						</span>
					)}
				</div>
			);
		}
		return days;
	};

	const renderEventForm = () => {
		return (
			<div className='space-y-4'>
				<div>
					<Label htmlFor='eventName'>Event Name</Label>
					<Input
						id='eventName'
						value={newEvent.name}
						onChange={(e) =>
							setNewEvent((prev) => ({ ...prev, name: e.target.value }))
						}
						placeholder='Enter event name'
					/>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label htmlFor='startTime'>Start Time</Label>
						<Input
							id='startTime'
							type='time'
							value={newEvent.startTime}
							onChange={(e) =>
								setNewEvent((prev) => ({ ...prev, startTime: e.target.value }))
							}
						/>
					</div>
					<div>
						<Label htmlFor='endTime'>End Time</Label>
						<Input
							id='endTime'
							type='time'
							value={newEvent.endTime}
							onChange={(e) =>
								setNewEvent((prev) => ({ ...prev, endTime: e.target.value }))
							}
						/>
					</div>
				</div>
				<div>
					<Label htmlFor='description'>Description (Optional)</Label>
					<Input
						id='description'
						value={newEvent.description}
						onChange={(e) =>
							setNewEvent((prev) => ({ ...prev, description: e.target.value }))
						}
						placeholder='Enter event description'
					/>
				</div>
				<Button
					onClick={addEvent}
					disabled={
						!newEvent.name.trim() || !newEvent.startTime || !newEvent.endTime
					}
					className='w-full'>
					{editingEventIndex !== null ? "Update Event" : "Add Event"}
				</Button>
			</div>
		);
	};

	return (
		<>
			<Card className='max-w-xl mx-auto shadow-2xl border border-gray-300'>
				<CardHeader>
					<div className='flex justify-between items-center'>
						<Button
							variant='outline'
							size='lg'
							className='p-3 rounded-full w-20 flex justify-center'
							onClick={prevMonth}>
							<ChevronLeftIcon className='h-6 w-6' />
						</Button>
						<div className='text-2xl font-bold text-gray-900'>
							{currentDate.toLocaleString("default", { month: "long" })}{" "}
							{currentDate.getFullYear()}
						</div>
						<Button
							variant='outline'
							size='lg'
							className='p-3 rounded-full w-20 flex justify-center'
							onClick={nextMonth}>
							<ChevronRightIcon className='h-6 w-6' />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-7 gap-1 text-center'>
						{daysInWeek.map((day) => (
							<div
								key={day}
								className='font-semibold text-gray-700 p-4 bg-gray-100 border-b border-gray-200'>
								{day}
							</div>
						))}
						{renderDays()}
					</div>
				</CardContent>
			</Card>

			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent className='h-full w-full fixed'>
					<DrawerHeader>
						<DrawerTitle>
							{selectedDay}{" "}
							{currentDate.toLocaleString("default", { month: "long" })}{" "}
							{currentDate.getFullYear()}
						</DrawerTitle>
						<DrawerDescription>Manage your events</DrawerDescription>
					</DrawerHeader>

					<div className='p-4 space-y-4'>
						{renderEventForm()}

						<div className='mt-4'>
							<h3 className='text-lg font-semibold mb-2'>Existing Events</h3>
							{selectedDay && (
								<div>
									{events[
										`${currentDate.getFullYear()}-${
											currentDate.getMonth() + 1
										}-${selectedDay}`
									] &&
										events[
											`${currentDate.getFullYear()}-${
												currentDate.getMonth() + 1
											}-${selectedDay}`
										].map((event, index) => (
											<div
												key={index}
												className='border p-3 rounded mb-2 flex justify-between items-center'>
												<div>
													<h4 className='font-medium'>{event.name}</h4>
													<p className='text-sm text-gray-500'>
														{event.startTime} - {event.endTime}
													</p>
													{event.description && (
														<p className='text-xs text-gray-400'>
															{event.description}
														</p>
													)}
												</div>
												<div className='flex space-x-2'>
													<Button
														variant='outline'
														size='icon'
														onClick={() => {
															setEditingEventIndex(index);
															setNewEvent(event);
														}}>
														<EditIcon className='h-4 w-4' />
													</Button>
													<Button
														variant='destructive'
														size='icon'
														onClick={() =>
															deleteEvent(
																`${currentDate.getFullYear()}-${
																	currentDate.getMonth() + 1
																}-${selectedDay}`,
																index
															)
														}>
														<TrashIcon className='h-4 w-4' />
													</Button>
												</div>
											</div>
										))}
									{(!events[
										`${currentDate.getFullYear()}-${
											currentDate.getMonth() + 1
										}-${selectedDay}`
									] ||
										events[
											`${currentDate.getFullYear()}-${
												currentDate.getMonth() + 1
											}-${selectedDay}`
										].length === 0) && (
										<p className='text-gray-500'>No events for this day</p>
									)}
								</div>
							)}
						</div>
					</div>

					<DrawerClose asChild>
						<Button variant='outline' className='absolute top-4 right-4'>
							Close
						</Button>
					</DrawerClose>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Calendar;
