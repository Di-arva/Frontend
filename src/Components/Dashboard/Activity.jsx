import { Clock,Hospital,UserPlus,UserCheck,CalendarCheck,CreditCard} from "lucide-react"

 const Activityies = [
  {
    id: 1,
    type: "Clinic",
    icon: Hospital,
    title: "New clinic registered",
    description: "Highland Dental Clinic registered successfully.",
    time: "5 minutes ago",
    color: "text-darkblue",
    bgColor: "bg-lightbg"
  },
  {
    id: 2,
    type: "Doctor",
    icon: UserPlus,
    title: "New doctor joined",
    description: "Dr. Emily Carter joined Highland Dental Clinic.",
    time: "12 minutes ago",
    color: "text-green-700",
    bgColor: "bg-green-100"
  },
  {
    id: 3,
    type: "Patient",
    icon: UserCheck,
    title: "New patient registered",
    description: "John Doe booked an appointment with Dr. Emily Carter.",
    time: "20 minutes ago",
    color: "text-purple-700",
    bgColor: "bg-purple-100"
  },
  {
    id: 4,
    type: "Appointment",
    icon: CalendarCheck,
    title: "Appointment confirmed",
    description: "Anna Smith’s appointment confirmed for 3 PM today.",
    time: "35 minutes ago",
    color: "text-orange-700",
    bgColor: "bg-orange-100"
  },
  {
    id: 5,
    type: "Payment",
    icon: CreditCard,
    title: "Payment received",
    description: "Payment of $120 received from Anna Smith.",
    time: "1 hour ago",
    color: "text-blue-700",
    bgColor: "bg-blue-100"
  }
];


const Activity = () => {
  return (
    <div className="bg-lightblue  backdrop-blur-xl rounded-2xl overflow-hidden">


         <div className="p-6">

            <div>
                <h3 className="text-xl font-semibold text-darkblue font-poppins">
                Recent Registartion
              </h3>
              <p className="text-sm text-darkblack font-poppins">Latest </p>
            </div>
            <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
              View All
            </button>
        </div>

        <div className="p-6">
            <div className="space-y-4">
               {Activityies.map((activity)=>{

               return( <div key={activity.id} className="flex items-start space-x-4 p-3 round-xl transition-colors font-poppins">
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`}/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-darkblue">{activity.title}</h4>
                        <p className="text-sm truncate text-darkblack">{activity.description}</p>
                        <div className="flex items-center-safe space-x-1 mt-1">
                            
                            <Clock className="w-3 h-3"/>
                            <span className="text-xs">{activity.time}</span>
                        </div>
                    </div>
                </div>)

               })}
            </div>
        </div>
    </div>
  )
}

export default Activity