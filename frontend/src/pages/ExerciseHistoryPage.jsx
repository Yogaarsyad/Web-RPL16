import React from 'react';
import ExerciseHistory from '../components/ExerciseHistory';

function ExerciseHistoryPage() {
  // Contoh data dummy
  const sampleExerciseLogs = [
    { nama_olahraga: 'Running', durasi_menit: 30, kalori_terbakar: 250, tanggal: '2024-01-15' },
    { nama_olahraga: 'Cycling', durasi_menit: 45, kalori_terbakar: 350, tanggal: '2024-01-14' },
    { nama_olahraga: 'Swimming', durasi_menit: 60, kalori_terbakar: 400, tanggal: '2024-01-13' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Exercise History</h1>
        <p className="text-gray-600 mb-8">Track your workout activities and calories burned.</p>
        <ExerciseHistory exerciseLogs={sampleExerciseLogs} />
      </div>
    </div>
  );
}

export default ExerciseHistoryPage;