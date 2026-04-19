export type WaitlistEntry = {
  id?: string
  email: string
  occupation: string
  job_role: string
  years_of_experience: number
  user_id: string
  created_at?: string
  updated_at?: string
}

export type WaitlistFormData = {
  email: string
  full_name: string
  whatsapp_number: string
  occupation: string
  job_role: string
  years_of_experience: number
  source: string
}

