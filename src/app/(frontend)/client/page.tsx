'use client'
import React, { useEffect } from 'react'
import semesterApiService from '@/services/semesterApiService'

export default function Client() {
  useEffect(() => {
    async function fetchSemesters() {
      try{
        const data = await semesterApiService.getAllSemesters()
        console.log(data)
      } catch (error) {
        console.error('Error fetching semesters:', error)
      }
    }
    fetchSemesters()
  }, []);
  return <div>This is the client page</div>
}
