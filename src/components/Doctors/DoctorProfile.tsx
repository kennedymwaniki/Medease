import { useState } from 'react'
import {
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Phone,
  Shield,
  Stethoscope,
  Upload,
  User,
  UserCircle,
  XCircle,
} from 'lucide-react'
import { useDoctor } from '@/hooks/useDoctors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import uploadFile from '@/lib/uploads'
import { useUpdateUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/authStore'

const DoctorProfile = () => {
  const user = useAuthStore((state) => state.user)
  const doctorId = user?.doctor?.id

  const { data: doctorData, isLoading, error } = useDoctor(doctorId!)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { updateUserProfile, isPending } = useUpdateUser()

  console.log('Doctor data:', doctorData)

  if (isPending) {
    return <div className="text-center">Updating profile...</div>
  }

  const userId = doctorData?.user.id
  console.log('User ID of the doctor:', userId)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    try {
      const imageUrl =
        'https://dlskybcztupsdcovqpma.supabase.co/storage/v1/object/public/medease/'
      const formData = new FormData()
      formData.append('image', selectedImage)

      console.log('Uploading image:', selectedImage.name)

      const data = await uploadFile(formData)
      console.log('Upload data:', data)

      const imageLink = imageUrl + data?.path
      const imagelink = {
        imagelink: imageLink,
      }

      if (userId) {
        updateUserProfile({ userId, data: imagelink })
      } else {
        console.error('User ID is undefined. Cannot update profile.')
      }

      console.log('Image uploaded successfully:', imageLink)

      // Reset form after successful upload
      setSelectedImage(null)
      setPreviewUrl(null)
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError)
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading profile</p>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!doctorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">
          <p className="text-xl font-semibold">Doctor not found</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const getSpecializationColor = (specialization: string) => {
    const colors = {
      cardiology: 'bg-red-100 text-red-800',
      neurology: 'bg-purple-100 text-purple-800',
      orthopedics: 'bg-blue-100 text-blue-800',
      pediatrics: 'bg-pink-100 text-pink-800',
      dermatology: 'bg-yellow-100 text-yellow-800',
      psychiatry: 'bg-indigo-100 text-indigo-800',
      general: 'bg-gray-100 text-gray-800',
    }

    const key = specialization.toLowerCase()
    return colors[key as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Get confirmed and pending appointments
  const confirmedAppointments = doctorData.appointments.filter(
    (apt) => apt.status === 'confirmed',
  )
  const pendingAppointments = doctorData.appointments.filter(
    (apt) => apt.status === 'pending',
  )

  return (
    <div className="mx-auto px-4 py-2 max-w-7xl">
      <div className="space-y-6 grid grid-cols-2 gap-8">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Doctor Profile
            </h1>
            <p className="text-gray-600">
              Manage your professional information and profile picture
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage
                    src={doctorData.user.imagelink || undefined}
                    alt={
                      doctorData.user.firstname + ' ' + doctorData.user.lastname
                    }
                  />
                  <AvatarFallback className="text-2xl">
                    {doctorData.user.imagelink ? (
                      <UserCircle className="h-16 w-16" />
                    ) : (
                      getInitials(
                        doctorData.user.firstname +
                          ' ' +
                          doctorData.user.lastname,
                      )
                    )}
                  </AvatarFallback>
                </Avatar>
                {!doctorData.user.imagelink && (
                  <p className="text-sm text-gray-500">
                    No profile picture uploaded
                  </p>
                )}
              </div>

              {/* Image Upload Form */}
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </label>
                </div>

                {/* Preview Section */}
                {previewUrl && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-full mx-auto"
                      />
                      <p className="text-sm text-gray-600 mt-2">Preview</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearSelection}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 font-medium">
                    {doctorData.user.firstname} {doctorData.user.lastname}
                  </span>
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getSpecializationColor(
                      doctorData.specialization,
                    )}
                  >
                    {doctorData.specialization}
                  </Badge>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Experience
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">
                    {doctorData.experience} years
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Availability
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getAvailabilityColor(doctorData.isAvailable)}
                  >
                    {doctorData.isAvailable ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contact
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{doctorData.contact}</span>
                </div>
              </div>

              {/* Affiliation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Affiliation
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">
                    {doctorData.affiliation}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{doctorData.user.email}</span>
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {doctorData.user.firstname}
                  </span>
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {doctorData.user.lastname}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    <Shield className="h-3 w-3 mr-1" />
                    {doctorData.user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {doctorData.appointments.length}
              </div>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {confirmedAppointments.length}
              </div>
              <p className="text-sm text-gray-600">Confirmed Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pendingAppointments.length}
              </div>
              <p className="text-sm text-gray-600">Pending Appointments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
