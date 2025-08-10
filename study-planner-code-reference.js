import React, { useState } from 'react';
import { Plus, X, Calendar, BookOpen, CheckCircle2, Clock } from 'lucide-react';

const StudyPlanner = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAddClass, setShowAddClass] = useState(false);

  // Add a new class
  const addClass = () => {
    if (newClassName.trim()) {
      const newClass = {
        id: Date.now(),
        name: newClassName.trim()
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
      setShowAddClass(false);
    }
  };

  // Delete a class and its assignments
  const deleteClass = (classId) => {
    setClasses(classes.filter(c => c.id !== classId));
    setAssignments(assignments.filter(a => a.classId !== classId));
    if (selectedClass === classId.toString()) {
      setSelectedClass('');
    }
  };

  // Add a new assignment
  const addAssignment = () => {
    if (assignmentName.trim() && dueDate && selectedClass) {
      const newAssignment = {
        id: Date.now(),
        name: assignmentName.trim(),
        dueDate: dueDate,
        classId: parseInt(selectedClass),
        completed: false
      };
      setAssignments([...assignments, newAssignment]);
      setAssignmentName('');
      setDueDate('');
    }
  };

  // Toggle assignment completion
  const toggleAssignment = (assignmentId) => {
    setAssignments(assignments.map(a => 
      a.id === assignmentId ? { ...a, completed: !a.completed } : a
    ));
  };

  // Delete an assignment
  const deleteAssignment = (assignmentId) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
  };

  // Get class name by ID
  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  // Sort assignments by due date for to-do list
  const sortedAssignments = [...assignments]
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Get completed assignments
  const completedAssignments = assignments.filter(a => a.completed);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if assignment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          📚 Study Planner
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To-Do List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Clock className="text-blue-500 mr-2" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">To-Do List</h2>
              </div>
              
              {sortedAssignments.length === 0 ? (
                <p className="text-gray-500 italic">No pending assignments</p>
              ) : (
                <div className="space-y-3">
                  {sortedAssignments.map(assignment => (
                    <div 
                      key={assignment.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        isOverdue(assignment.dueDate) 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {assignment.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getClassName(assignment.classId)}
                          </p>
                          <p className={`text-sm font-medium ${
                            isOverdue(assignment.dueDate) ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            Due: {formatDate(assignment.dueDate)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleAssignment(assignment.id)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button
                            onClick={() => deleteAssignment(assignment.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Assignments */}
            {completedAssignments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="text-green-500 mr-2" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">Completed</h3>
                </div>
                <div className="space-y-2">
                  {completedAssignments.map(assignment => (
                    <div key={assignment.id} className="p-2 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700 line-through">
                            {assignment.name}
                          </div>
                          <p className="text-sm text-gray-500">
                            {getClassName(assignment.classId)}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Class Management */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="text-indigo-500 mr-2" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
                </div>
                <button
                  onClick={() => setShowAddClass(true)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-1" />
                  Add Class
                </button>
              </div>

              {showAddClass && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Enter class name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyPress={(e) => e.key === 'Enter' && addClass()}
                    />
                    <button
                      onClick={addClass}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddClass(false);
                        setNewClassName('');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {classes.length === 0 ? (
                <p className="text-gray-500 italic">No classes added yet. Add your first class to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map(cls => {
                    const classAssignments = assignments.filter(a => a.classId === cls.id);
                    const pendingCount = classAssignments.filter(a => !a.completed).length;
                    
                    return (
                      <div key={cls.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{cls.name}</h3>
                            <p className="text-sm text-gray-600">
                              {classAssignments.length} total assignments
                              {pendingCount > 0 && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  {pendingCount} pending
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteClass(cls.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Assignment Entry */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-purple-500 mr-2" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Add Assignment</h2>
              </div>

              {classes.length === 0 ? (
                <p className="text-gray-500 italic">Please add at least one class before creating assignments.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Choose a class...</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Name
                    </label>
                    <input
                      type="text"
                      value={assignmentName}
                      onChange={(e) => setAssignmentName(e.target.value)}
                      placeholder="Enter assignment name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    onClick={addAssignment}
                    disabled={!assignmentName.trim() || !dueDate || !selectedClass}
                    className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Add Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;