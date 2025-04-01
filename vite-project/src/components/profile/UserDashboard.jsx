import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, Award, GitBranch, Star, Clock } from 'lucide-react';

const UserDashboard = ({ metrics, userInfo, projects }) => {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00ff9d]/10">
              <GitBranch className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{metrics.totalProjects}</h3>
              <p className="text-gray-400">Total Projects</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00ff9d]/10">
              <Star className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{metrics.completedProjects}</h3>
              <p className="text-gray-400">Completed Projects</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#00ff9d]/10">
              <Activity className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{metrics.activeStreak} days</h3>
              <p className="text-gray-400">Active Streak</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold mb-6">Project Progress</h3>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.projectId._id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{project.projectId.title}</span>
                <span>{Math.round(metrics.projectProgress[project.projectId._id] || 0)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00ff9d] rounded-full transition-all duration-500"
                  style={{ width: `${metrics.projectProgress[project.projectId._id] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {metrics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-400">{activity}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;