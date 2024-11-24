export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* School Statistics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">إحصائيات المدارس</h3>
        <div className="space-y-2">
          {/* Show total students per school */}
          {/* Show selection rates */}
          {/* Show sport distribution */}
        </div>
      </div>

      {/* Age Group Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">توزيع الفئات العمرية</h3>
        {/* Age group charts */}
      </div>

      {/* Selection Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">حالة الانتقاء</h3>
        {/* Selection progress */}
        {/* Status distribution */}
      </div>
    </div>
  );
} 