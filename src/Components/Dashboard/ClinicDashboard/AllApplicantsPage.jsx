import { useState, useEffect } from "react";
import { Users, Search, Filter, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Button from "../../Button";

const AllApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    shift: "",
    date_applied: "",
  });

  const fetchAllApplicants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL;
      
      // You'll need to create this endpoint in your backend
      const response = await fetch(`${apiBaseUrl}clinic/applicants/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch applicants');
      
      const result = await response.json();
      setApplicants(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-darkblue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-lightblue rounded-4xl min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-normal text-darkblack mb-4">
            All Applicants
          </h3>
          <span className="px-3 py-1 text-lightbg bg-darkblue rounded-full text-sm font-medium">
            {applicants.length} Total Applicant{applicants.length !== 1 ? "s" : ""}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-darkblue" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="pl-10 pr-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue"
            />
          </div>
          <Button
            variant="dark"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-4">
        {applicants.map((applicant) => (
          <div key={applicant._id} className="bg-white rounded-3xl p-6 shadow-sm border border-darkblue/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-darkblack mb-2">
                  {applicant.name}
                </h4>
                <div className="flex items-center gap-4 text-sm text-darkblack/70">
                  {applicant.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {applicant.email}
                    </div>
                  )}
                  {applicant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {applicant.phone}
                    </div>
                  )}
                  {applicant.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {applicant.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  applicant.status === 'approved' ? 'bg-green-100 text-green-700' :
                  applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {applicant.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-darkblue" />
                <span>Applied: {new Date(applicant.applied_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-darkblue" />
                <span>Shift: {applicant.shift_title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Certification: {applicant.certification_level}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-darkblack">Experience: {applicant.experience_years} years</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="light" size="sm">
                  View Profile
                </Button>
                <Button variant="dark" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applicants.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-12 text-center">
          <Users className="w-16 h-16 text-darkblue/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-darkblack mb-2">
            No applicants found
          </h3>
          <p className="text-darkblack/70">
            Applicants will appear here when they apply to your shifts
          </p>
        </div>
      )}
    </div>
  );
};

export default AllApplicantsPage;