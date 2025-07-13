// API Response Types for MedEase Backend

// ===== ENUMS =====
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PrescriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

// ===== BASE ENTITY TYPES =====
export interface User {
  id: number
  email: string
  password: string
  role: UserRole
  firstname: string
  lastname: string
  otp?: string
  secret?: string
  imagelink?: string | null
  hashedRefreshToken?: string | null
  patient?: Patient
  doctor?: Doctor
}

export interface Doctor {
  id: number
  specialization: string
  experience: number
  contact: string
  name?: string
  isAvailable: boolean
  affiliation: string
  user: User
  appointments: Array<Appointment>
}

export interface Patient {
  id: number
  name: string
  age: number
  gender: string
  contact: string
  address: string
  user: User
  appointments: Array<Appointment>
  prescriptions: Array<Prescription>
  medicalHistories: Array<MedicalHistory>
  payments: Array<Payment>
}

export interface Appointment {
  id: number
  date: string
  time: string
  status: AppointmentStatus
  duration: number
  title: string
  patient: Patient
  doctor: Doctor
}

export interface Medication {
  id: number
  name: string
  description: string
  dosage: string
  type: string
  route: string
  manufacturer: string
  expirationDate: Date
  stock?: MedicationStock
  prescriptions: Array<Prescription>
}

export interface MedicationStock {
  id: number
  medicationId: number
  currentQuantity: number
  minimumQuantity: number
  location: string
  batchNumber: string
  expirationDate: Date
  medication: Medication
}

export interface Prescription {
  id: number
  frequency: string
  medicationName: string
  dosage: string
  status: PrescriptionStatus
  startDate: Date
  endDate: Date
  patient: Patient
  payment?: Payment
  medication: Medication
}

export interface Payment {
  id: number
  amount: number
  method: string
  status: PaymentStatus
  paymentDate: Date
  transactionId: string
  patient: Patient
  prescription: Prescription
}

export interface MedicalHistory {
  id: number
  symptoms: string
  diagnosis: string
  treatment: string
  notes: string
  patient: Patient
}

// ===== DTO TYPES (CREATE/UPDATE) =====
export interface CreateUserDto {
  email: string
  password: string
  role: UserRole
  firstname: string
  imagelink?: string | null
  lastname: string
  otp?: string
  secret?: string
  hashedRefreshToken?: string | null
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface CreateDoctorDto {
  specialization: string
  experience: number
  userId: number
  contact: string
  isAvailable: boolean
  affiliation: string
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {}

export interface CreatePatientDto {
  name: string
  age: number
  userId: number
  gender: string
  contact: string
  address: string
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export interface CreateAppointmentDto {
  date: string
  time: string
  status: AppointmentStatus
  duration: number
  title: string
  patientId: number
  doctorId: number
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {}

export interface CreateMedicationDto {
  name: string
  description: string
  dosage: string
  type: string
  route: string
  manufacturer: string
  expirationDate: Date
}

export interface UpdateMedicationDto extends Partial<CreateMedicationDto> {}

export interface CreateMedicationStockDto {
  medicationId: number
  currentQuantity: number
  minimumQuantity: number
  location: string
  batchNumber: string
  expirationDate: Date
}

export interface UpdateMedicationStockDto
  extends Partial<CreateMedicationStockDto> {}

export interface CreatePrescriptionDto {
  frequency: string
  duration: string
  dosage: string
  status: PrescriptionStatus
  startDate: Date
  endDate: Date
  patientId: number
  medicationId: number
}

export interface UpdatePrescriptionDto extends Partial<CreatePrescriptionDto> {}

export interface CreatePaymentDto {
  amount: number
  method: string
  status: PaymentStatus
  paymentDate: Date
  transactionId: string
  patientId: number
  prescriptionId: number
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}

export interface CreateMedicalHistoryDto {
  symptoms: string
  diagnosis: string
  treatment: string
  notes: string
  patientId: number
}

export interface UpdateMedicalHistoryDto
  extends Partial<CreateMedicalHistoryDto> {}

// ===== AUTH TYPES =====
export interface LoginDto {
  email: string
  password: string
}

export interface PasswordResetRequestDto {
  email: string
}

export interface ResetPasswordDto {
  email: string
  otp: string
  newPassword: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ===== API RESPONSE WRAPPER TYPES =====
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  error: string
  statusCode: number
}

// ===== ENDPOINT RESPONSE TYPES =====

// Users endpoints
export type GetUsersResponse = Array<User>
export type GetUserResponse = User
export type CreateUserResponse = User
export type UpdateUserResponse = User
export type DeleteUserResponse = void

// Doctors endpoints
export type GetDoctorsResponse = Array<Doctor>
export type GetDoctorResponse = Doctor
export type CreateDoctorResponse = Doctor
export type UpdateDoctorResponse = Doctor
export type DeleteDoctorResponse = void

// Patients endpoints
export type GetPatientsResponse = Array<Patient>
export type GetPatientResponse = Patient
export type CreatePatientResponse = Patient
export type UpdatePatientResponse = Patient
export type DeletePatientResponse = void

// Appointments endpoints
export type GetAppointmentsResponse = Array<Appointment>
export type GetAppointmentResponse = Appointment
export type CreateAppointmentResponse = Appointment
export type UpdateAppointmentResponse = Appointment
export type DeleteAppointmentResponse = void
export type GetTodayAppointmentsResponse = Array<Appointment>

// Medications endpoints
export type GetMedicationsResponse = Array<Medication>
export type GetMedicationResponse = Medication
export type CreateMedicationResponse = Medication
export type UpdateMedicationResponse = Medication
export type DeleteMedicationResponse = void

// Medication Stock endpoints
export type GetMedicationStocksResponse = Array<MedicationStock>
export type GetMedicationStockResponse = MedicationStock
export type CreateMedicationStockResponse = MedicationStock
export type UpdateMedicationStockResponse = MedicationStock
export type DeleteMedicationStockResponse = void

// Prescriptions endpoints
export type GetPrescriptionsResponse = Array<Prescription>
export type GetPrescriptionResponse = Prescription
export type CreatePrescriptionResponse = Prescription
export type UpdatePrescriptionResponse = Prescription
export type DeletePrescriptionResponse = void

// Payments endpoints
export type GetPaymentsResponse = Array<Payment>
export type GetPaymentResponse = Payment
export type CreatePaymentResponse = Payment
export type UpdatePaymentResponse = Payment
export type DeletePaymentResponse = void

// Medical History endpoints
export type GetMedicalHistoriesResponse = Array<MedicalHistory>
export type GetMedicalHistoryResponse = MedicalHistory
export type CreateMedicalHistoryResponse = MedicalHistory
export type UpdateMedicalHistoryResponse = MedicalHistory
export type DeleteMedicalHistoryResponse = void

// Auth endpoints
export type LoginResponse = AuthResponse
export type RefreshResponse = RefreshTokenResponse
export type PasswordResetRequestResponse = { message: string }
export type ResetPasswordResponse = { message: string }
export type SignOutResponse = { message: string }

// ===== API CLIENT TYPES =====
export interface ApiClient {
  // Auth endpoints
  login: (data: LoginDto) => Promise<LoginResponse>
  refreshToken: (id: number) => Promise<RefreshResponse>
  signOut: (id: number) => Promise<SignOutResponse>
  requestPasswordReset: (
    data: PasswordResetRequestDto,
  ) => Promise<PasswordResetRequestResponse>
  resetPassword: (data: ResetPasswordDto) => Promise<ResetPasswordResponse>

  // Users endpoints
  getUsers: () => Promise<GetUsersResponse>
  getUser: (id: number) => Promise<GetUserResponse>
  createUser: (data: CreateUserDto) => Promise<CreateUserResponse>
  updateUser: (id: number, data: UpdateUserDto) => Promise<UpdateUserResponse>
  deleteUser: (id: number) => Promise<DeleteUserResponse>

  // Doctors endpoints
  getDoctors: () => Promise<GetDoctorsResponse>
  getDoctor: (id: number) => Promise<GetDoctorResponse>
  createDoctor: (data: CreateDoctorDto) => Promise<CreateDoctorResponse>
  updateDoctor: (
    id: number,
    data: UpdateDoctorDto,
  ) => Promise<UpdateDoctorResponse>
  deleteDoctor: (id: number) => Promise<DeleteDoctorResponse>

  // Patients endpoints
  getPatients: () => Promise<GetPatientsResponse>
  getPatient: (id: number) => Promise<GetPatientResponse>
  createPatient: (data: CreatePatientDto) => Promise<CreatePatientResponse>
  updatePatient: (
    id: number,
    data: UpdatePatientDto,
  ) => Promise<UpdatePatientResponse>
  deletePatient: (id: number) => Promise<DeletePatientResponse>

  // Appointments endpoints
  getAppointments: () => Promise<GetAppointmentsResponse>
  getAppointment: (id: number) => Promise<GetAppointmentResponse>
  createAppointment: (
    data: CreateAppointmentDto,
  ) => Promise<CreateAppointmentResponse>
  updateAppointment: (
    id: number,
    data: UpdateAppointmentDto,
  ) => Promise<UpdateAppointmentResponse>
  deleteAppointment: (id: number) => Promise<DeleteAppointmentResponse>
  getTodayAppointments: () => Promise<GetTodayAppointmentsResponse>

  // Medications endpoints
  getMedications: () => Promise<GetMedicationsResponse>
  getMedication: (id: number) => Promise<GetMedicationResponse>
  createMedication: (
    data: CreateMedicationDto,
  ) => Promise<CreateMedicationResponse>
  updateMedication: (
    id: number,
    data: UpdateMedicationDto,
  ) => Promise<UpdateMedicationResponse>
  deleteMedication: (id: number) => Promise<DeleteMedicationResponse>

  // Medication Stock endpoints
  getMedicationStocks: () => Promise<GetMedicationStocksResponse>
  getMedicationStock: (id: number) => Promise<GetMedicationStockResponse>
  createMedicationStock: (
    data: CreateMedicationStockDto,
  ) => Promise<CreateMedicationStockResponse>
  updateMedicationStock: (
    id: number,
    data: UpdateMedicationStockDto,
  ) => Promise<UpdateMedicationStockResponse>
  deleteMedicationStock: (id: number) => Promise<DeleteMedicationStockResponse>

  // Prescriptions endpoints
  getPrescriptions: () => Promise<GetPrescriptionsResponse>
  getPrescription: (id: number) => Promise<GetPrescriptionResponse>
  createPrescription: (
    data: CreatePrescriptionDto,
  ) => Promise<CreatePrescriptionResponse>
  updatePrescription: (
    id: number,
    data: UpdatePrescriptionDto,
  ) => Promise<UpdatePrescriptionResponse>
  deletePrescription: (id: number) => Promise<DeletePrescriptionResponse>

  // Payments endpoints
  getPayments: () => Promise<GetPaymentsResponse>
  getPayment: (id: number) => Promise<GetPaymentResponse>
  createPayment: (data: CreatePaymentDto) => Promise<CreatePaymentResponse>
  updatePayment: (
    id: number,
    data: UpdatePaymentDto,
  ) => Promise<UpdatePaymentResponse>
  deletePayment: (id: number) => Promise<DeletePaymentResponse>

  // Medical History endpoints
  getMedicalHistories: () => Promise<GetMedicalHistoriesResponse>
  getMedicalHistory: (id: number) => Promise<GetMedicalHistoryResponse>
  createMedicalHistory: (
    data: CreateMedicalHistoryDto,
  ) => Promise<CreateMedicalHistoryResponse>
  updateMedicalHistory: (
    id: number,
    data: UpdateMedicalHistoryDto,
  ) => Promise<UpdateMedicalHistoryResponse>
  deleteMedicalHistory: (id: number) => Promise<DeleteMedicalHistoryResponse>
}

// ===== UTILITY TYPES =====
export type EntityId = number
export type DateString = string

// Pagination types (if you implement pagination later)
export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface PaginatedResponse<T> {
  data: Array<T>
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Filter types for different entities
export interface UserFilters {
  role?: UserRole
  email?: string
}

export interface AppointmentFilters {
  date?: string
  status?: AppointmentStatus
  doctorId?: number
  patientId?: number
}

export interface PrescriptionFilters {
  status?: PrescriptionStatus
  patientId?: number
  medicationId?: number
}

export interface PaymentFilters {
  status?: PaymentStatus
  patientId?: number
  dateFrom?: string
  dateTo?: string
}
