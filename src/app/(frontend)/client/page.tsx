'use client'
import React, { useEffect } from 'react'
import semesterApiService from '@/services/semesterApiService'

export default function Client() {
  useEffect(() => {
    semesterApiService.getAllSemesters({ page: 1, limit: 10 })
  }, [])
  return <div>This is the client page</div>
}
