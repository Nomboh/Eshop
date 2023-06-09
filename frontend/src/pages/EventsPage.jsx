import React from "react"
import EventCard from "../components/Events/EventCard"
import Header from "../components/Layout/Header"
import { useSelector } from "react-redux"
import Loader from "../components/Layout/Loader"

const EventsPage = () => {
	const { allEvents, isLoading } = useSelector((state) => state.event)
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<Header activeHeading={4} />
					{allEvents &&
						allEvents.map((event) => (
							<EventCard key={event._id} active={true} data={event} />
						))}
				</div>
			)}
		</>
	)
}

export default EventsPage
