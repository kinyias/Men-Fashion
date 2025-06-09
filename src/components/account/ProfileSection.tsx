"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Save, X, Upload, Phone, Mail, MapPin, Cake } from "lucide-react"
import toast from "react-hot-toast"

// Mock user data
const initialUserData = {
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-05-15",
  bio: "Fashion enthusiast and style blogger. Love discovering new trends and timeless pieces.",
  address: "123 Fashion Street, Style City, SC 12345",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: "March 15, 2022",
  emailVerified: true,
  phoneVerified: false,
}

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const [formData, setFormData] = useState(initialUserData)

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(userData)
  }

  const handleSave = () => {
    setUserData(formData)
    setIsEditing(false)
    toast.success(
  "Your profile information has been successfully updated."
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">


            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {userData.firstName} {userData.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={userData.emailVerified ? "default" : "secondary"}>
                  {userData.emailVerified ? "Email Verified" : "Email Unverified"}
                </Badge>
                <Badge variant={userData.phoneVerified ? "default" : "secondary"}>
                  {userData.phoneVerified ? "Phone Verified" : "Phone Unverified"}
                </Badge>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <span>{userData.firstName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <span>{userData.lastName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Cake className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(userData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{userData.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{userData.address}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="p-3 bg-muted rounded-md">
                <span>{userData.bio}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Your activity and engagement summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$3,240</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2,450</div>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
