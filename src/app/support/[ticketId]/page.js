import TicketDetailClient from "./TicketDetailClient";

export const metadata = {
  title: "Ticket Details - Mind Gym Book",
  description: "View ticket details and messages.",
};

export default async function TicketDetailPage({ params }) {
  const { ticketId } = await params;
  return <TicketDetailClient ticketId={ticketId} />;
}
