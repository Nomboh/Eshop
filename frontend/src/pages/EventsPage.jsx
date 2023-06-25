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
					{allEvents && allEvents?.length > 0 ? (
						allEvents.map((event) => (
							<EventCard key={event._id} active={true} data={event} />
						))
					) : (
						<h4 className=" text-center text-4xl mt-12">
							There are no events at moment
						</h4>
					)}
				</div>
			)}
		</>
	)
}

export default EventsPage
