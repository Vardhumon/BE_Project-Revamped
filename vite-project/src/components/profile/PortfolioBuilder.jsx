import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  // Header section (horizontal layout)
  headerSection: {
    borderBottom: '1 solid #EEEEEE',
    paddingBottom: 20,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameAndTitle: {
    flex: 1,
  },
  contactInfo: {
    width: 200,
    fontSize: 9,
    color: '#555555',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  contactLabel: {
    width: 60,
    color: '#777777',
  },
  contactValue: {
    flex: 1,
  },
  // Professional info section (horizontal layout)
  professionalSection: {
    flexDirection: 'row',
    borderBottom: '1 solid #EEEEEE',
    paddingBottom: 15,
    marginBottom: 15,
  },
  skillsColumn: {
    flex: 1,
    paddingRight: 10,
    minHeight: 80,
  },
  educationColumn: {
    flex: 1,
    paddingLeft: 10,
    borderLeft: '1 solid #EEEEEE',
    minHeight: 80,
  },
  // Typography
  header: { 
    fontSize: 24,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#222222'
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 10,
    color: '#666666',
    fontStyle: 'italic'
  },
  bio: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#444444',
    maxWidth: 350,
  },
  sectionTitle: { 
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 2
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textTransform: 'uppercase'
  },
  // Skills
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 9,
    marginBottom: 4,
    marginRight: 6,
    padding: '3 6',
    backgroundColor: '#f7f7f7',
    borderRadius: 3,
    color: '#444444'
  },
  // Projects section
  section: { 
    marginBottom: 15
  },
  text: { 
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.5,
    color: '#444444'
  },
  projectsContainer: {
    flexDirection: 'column',
  },
  projectRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '0.5 solid #f0f0f0',
  },
  projectTitle: { 
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#333333'
  },
  projectMeta: {
    fontSize: 9,
    marginBottom: 3,
    color: '#777777'
  },
  projectDescription: {
    fontSize: 10,
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#444444'
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 8,
    lineHeight: 1.3,
    color: '#444444'
  },
  subBulletPoint: {
    fontSize: 9,
    marginBottom: 2,
    marginLeft: 16,
    lineHeight: 1.2,
    color: '#555555'
  },
  personalInfoText: {
    fontSize: 10,
    marginBottom: 4,
    color: '#555555'
  },
  experienceLevel: {
    fontSize: 10,
    marginTop: 4,
    color: '#666666',
    fontStyle: 'italic'
  }
});

const PortfolioPDF = ({ userInfo, projects }) => {
  // Helper function to safely handle tech stack
  const renderTechStack = (techStack) => {
    if (!techStack) return [];
    if (Array.isArray(techStack)) return techStack;
    if (typeof techStack === 'string') return techStack.split(',').map(s => s.trim());
    return [String(techStack)];
  };

  // Format a date string or return empty string
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section - Horizontal Layout */}
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <View style={styles.nameAndTitle}>
              <Text style={styles.header}>{userInfo?.name || 'Portfolio'}</Text>
              <Text style={styles.subHeader}>{userInfo?.title || 'Software Developer'}</Text>
              <Text style={styles.bio}>{userInfo?.bio || ''}</Text>
              <Text style={styles.experienceLevel}>Experience Level: {userInfo?.experienceLevel || 'Not specified'}</Text>
            </View>
            
            <View style={styles.contactInfo}>
              {userInfo?.email && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Email:</Text>
                  <Text style={styles.contactValue}>{userInfo.email}</Text>
                </View>
              )}
              {userInfo?.phone && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Phone:</Text>
                  <Text style={styles.contactValue}>{userInfo.phone}</Text>
                </View>
              )}
              {userInfo?.location && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Location:</Text>
                  <Text style={styles.contactValue}>{userInfo.location}</Text>
                </View>
              )}
              {userInfo?.website && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Website:</Text>
                  <Text style={styles.contactValue}>{userInfo.website}</Text>
                </View>
              )}
              {userInfo?.github && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>GitHub:</Text>
                  <Text style={styles.contactValue}>{userInfo.github}</Text>
                </View>
              )}
              {userInfo?.linkedin && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>LinkedIn:</Text>
                  <Text style={styles.contactValue}>{userInfo.linkedin}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Professional Info Section - Horizontal Layout */}
        <View style={styles.professionalSection}>
          {/* Skills Column */}
          <View style={styles.skillsColumn}>
            <Text style={styles.columnTitle}>Technical Skills</Text>
            <View style={styles.skillsGrid}>
              {renderTechStack(userInfo?.techStack).map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
          
          {/* Education Column */}
          <View style={styles.educationColumn}>
            <Text style={styles.columnTitle}>Education</Text>
            <Text style={styles.personalInfoText}>{userInfo?.education || 'Not specified'}</Text>
          </View>
        </View>

        {/* Projects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Experience</Text>
          <View style={styles.projectsContainer}>
            {(projects || []).map((project, index) => (
              <View key={index} style={styles.projectRow}>
                <Text style={styles.projectTitle}>
                  {project?.projectId?.title || 'Untitled Project'}
                </Text>
                <Text style={styles.projectMeta}>
                  {formatDate(project?.startDate)} - {project?.endDate ? formatDate(project.endDate) : 'Present'} | 
                  Tech: {(project?.projectId?.techStack || []).join(' • ')}
                </Text>
                <Text style={styles.projectDescription}>
                  {project?.projectId?.description || ''}
                </Text>
                
                {/* Project Details - Restructured for clarity */}
                {project?.projectId?.steps && (
                  <View>
                    {project.projectId.steps.map((step, stepIndex) => (
                      <View key={stepIndex}>
                        <Text style={styles.bulletPoint}>
                          • {step.step || 'Step ' + (stepIndex + 1)}
                        </Text>
                        {step.subSteps && (
                          <View>
                            {step.subSteps.map((subStep, subIndex) => (
                              <Text key={subIndex} style={styles.subBulletPoint}>
                                • {subStep}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
                
                {/* Implementation Details */}
                {project?.projectId?.implementation && (
                  <Text style={styles.bulletPoint}>
                    • Implementation: {project.projectId.implementation}
                  </Text>
                )}
                
                {/* Project Status */}
                <Text style={[styles.projectMeta, { fontStyle: 'italic', marginTop: 3 }]}>
                  Status: {project?.status || 'Completed'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PortfolioBuilder = ({ userInfo, projects }) => {
  return (
    <div className="mt-8 flex justify-center">
      <PDFDownloadLink
        document={<PortfolioPDF userInfo={userInfo} projects={projects} />}
        fileName={`${userInfo.name?.replace(/\s+/g, '_') || 'portfolio'}_resume.pdf`}
      >
        {({ loading }) => (
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff9d] text-black font-medium hover:bg-[#00cc7d] transition-all duration-300 ${
              loading ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Download className="w-5 h-5" />
            {loading ? 'Generating Resume...' : 'Download Resume'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PortfolioBuilder;