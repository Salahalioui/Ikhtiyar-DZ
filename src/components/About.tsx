import { 
  Users, Medal, FileText, Wifi, 
  Share2, Settings, ListChecks, BarChart 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Student Management",
      description: "Efficiently manage student records with essential information including name, date of birth, and school details. Add, edit, and delete records with ease."
    },
    {
      icon: <Medal className="h-6 w-6" />,
      title: "Dual Sport Evaluation",
      description: "Comprehensive evaluation system for both football and athletics, with customizable metrics for skills like speed, agility, ball control, and more."
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Track and analyze student performance with detailed metrics, rankings, and progress tracking. Compare performance across schools and age groups."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Advanced Reporting",
      description: "Generate detailed reports for individual students, schools, or overall performance. Export data in PDF and CSV formats for further analysis."
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Offline Functionality",
      description: "Work seamlessly without internet connection. All data is stored locally on your device for reliable access anywhere."
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Expert Collaboration",
      description: "Share evaluations and data between team members using simple export/import functionality."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Customizable Metrics",
      description: "Adapt the evaluation system to your needs by modifying existing metrics or adding new ones for each sport."
    },
    {
      icon: <ListChecks className="h-6 w-6" />,
      title: "Selection Tracking",
      description: "Keep track of selected, eliminated, and pending candidates with a clear status system and filtering options."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Official Headers */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
        <div className="text-lg text-gray-600">وزارة التربية الوطنية</div>
        <div className="flex justify-center gap-8 text-lg">
          <div>مديرية التربية لولاية البيض</div>
          <div>الرابطة الولائية المدرسية</div>
        </div>
      </div>

      {/* App Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ikhtiyar DZ</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          نظام انتقاء المواهب الرياضية المدرسية
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Workflow Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
              1
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Initial Setup</h3>
              <p className="text-gray-600">Start by adding students and their basic information. Organize them by school and age groups.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
              2
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Evaluation Process</h3>
              <p className="text-gray-600">Conduct evaluations for each student in their chosen sport, rating various skills and adding comments.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
              3
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Analysis & Selection</h3>
              <p className="text-gray-600">Review performance data, rankings, and make informed decisions about student selection.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
              4
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Reporting & Sharing</h3>
              <p className="text-gray-600">Generate comprehensive reports and share results with team members and stakeholders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-6">
          For support, feature requests, or general inquiries, please contact our team.
        </p>
        <a 
          href="mailto:support@ikhtiyardz.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </a>
      </div>

      {/* Official Support Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">بدعم من</h2>
        <div className="space-y-2">
          <p className="text-lg font-medium">مديرية التربية لولاية البيض</p>
          <p className="text-lg font-medium">الرابطة الولائية المدرسية</p>
        </div>
      </div>
    </div>
  );
} 