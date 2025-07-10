import { useState } from 'react'
import {
  Calendar,
  Camera,
  MapPin,
  Upload,
  User,
  UserCircle,
} from 'lucide-react'
import { usePatient } from '@/hooks/usePatients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import uploadFile from '@/lib/uploads'

function PatientProfile() {
  const patientId = 1
  const { data: patientData, isLoading, error } = usePatient(patientId)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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
      // TODO: Implement actual image upload logic here
      const formData = new FormData()
      formData.append('image', selectedImage)

      console.log('Uploading image:', selectedImage.name)

      const data = await uploadFile(formData)
      console.log('This is the data after upload:', data)

      // Reset form after successful upload
      setSelectedImage(null)
      setPreviewUrl(null)

      // TODO: Refetch patient data to get updated image
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
          <p className="mt-4 text-gray-600">Loading patient profile...</p>
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

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">
          <p className="text-xl font-semibold">Patient not found</p>
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

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800'
      case 'female':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className=" mx-auto px-4 py-2 max-w-7xl">
      <div className="space-y-6 grid grid-cols-2 gap-8">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Patient Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and profile picture
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
                    src={patientData.user.imagelink || undefined}
                    alt={patientData.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {patientData.user.imagelink ? (
                      <UserCircle className="h-16 w-16" />
                    ) : (
                      getInitials(patientData.name)
                    )}
                  </AvatarFallback>
                </Avatar>
                {!patientData.user.imagelink && (
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

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
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
                    {patientData.name}
                  </span>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">
                    {patientData.age} years old
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex items-center gap-2">
                  <Badge className={getGenderColor(patientData.gender)}>
                    {patientData.gender}
                  </Badge>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contact
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{patientData.contact}</span>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-900">{patientData.address}</span>
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
                  <span className="text-gray-900">
                    {patientData.user.email}
                  </span>
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {patientData.user.firstname}
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
                    {patientData.user.lastname}
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
                    {patientData.user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {patientData.appointments.length}
              </div>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {patientData.prescriptions.length}
              </div>
              <p className="text-sm text-gray-600">Active Prescriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {patientData.medicalHistories.length}
              </div>
              <p className="text-sm text-gray-600">Medical Records</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile
