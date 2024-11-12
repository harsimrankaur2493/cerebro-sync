import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import ViewNotofication from "./ViewNotification";
import { useGetNotoficationsQuery, useMarkNotiAsReadMutation, useMarkAllAsReadMutation } from "../redux/slices/api/userApiSlice";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Get notifications from the API
  const { data, refetch } = useGetNotoficationsQuery();
  
  // Mutations for marking notifications as read
  const [markAsRead] = useMarkNotiAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();  // Mutation to mark all as read

  // Handle marking an individual notification as read
  const readHandler = async (type, id) => {
    try {
      if (type === "all") {
        // Mark all notifications as read
        await markAllAsRead().unwrap();
      } else {
        // Mark a specific notification as read
        await markAsRead({ type, id }).unwrap();
      }
      refetch();  // Refetch the notifications after marking as read
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Open the notification detail view and mark as read
  const viewHandler = (el) => {
    setSelected(el);
    readHandler("one", el._id);  // Mark individual notification as read
    setOpen(true);  // Open the modal to view the notification
  };

  // Actions for marking all notifications as read
  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),  // Mark all as read
    },
  ];

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {data?.length > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {data?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              data?.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className={`group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 ${
                          item.isRead ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notiType]}
                        </div>

                        <div className="cursor-pointer" onClick={() => viewHandler(item)}>
                          <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                            <p>{item.notiType}</p>
                            <span className="text-xs font-normal lowercase">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-gray-600">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={item?.onClick ? () => item.onClick() : () => close()}
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>

      {/* Modal for viewing notification details */}
      <ViewNotofication open={open} setOpen={setOpen} el={selected} />
    </>
  );
};

export default NotificationPanel;
