"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Crown, Gift, Trophy, Calendar, ShoppingBag, Zap, Award } from "lucide-react"

// Mock loyalty program data
const loyaltyData = {
  currentTier: "Gold",
  points: 2450,
  pointsToNextTier: 550,
  nextTier: "Platinum",
  totalSpent: 3240.5,
  memberSince: "March 2022",
  benefits: {
    Gold: [
      "15% off all purchases",
      "Free shipping on orders over $50",
      "Early access to sales",
      "Birthday month discount",
      "Priority customer support",
    ],
    Platinum: [
      "20% off all purchases",
      "Free shipping on all orders",
      "Exclusive product previews",
      "Personal stylist consultation",
      "VIP customer support",
      "Special event invitations",
    ],
  },
  recentActivity: [
    {
      id: "1",
      type: "earned",
      points: 89,
      description: "Purchase - Classic Oxford Shirt",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "redeemed",
      points: -500,
      description: "Redeemed $25 discount",
      date: "2024-01-10",
    },
    {
      id: "3",
      type: "earned",
      points: 125,
      description: "Purchase - Premium Wool Coat",
      date: "2024-01-08",
    },
    {
      id: "4",
      type: "bonus",
      points: 200,
      description: "Birthday bonus points",
      date: "2024-01-05",
    },
  ],
  availableRewards: [
    {
      id: "1",
      name: "$10 Off Your Next Purchase",
      points: 200,
      description: "Get $10 off any purchase over $50",
      category: "discount",
    },
    {
      id: "2",
      name: "$25 Off Your Next Purchase",
      points: 500,
      description: "Get $25 off any purchase over $100",
      category: "discount",
    },
    {
      id: "3",
      name: "Free Shipping for 3 Months",
      points: 300,
      description: "Enjoy free shipping on all orders for 3 months",
      category: "shipping",
    },
    {
      id: "4",
      name: "Exclusive Style Guide",
      points: 150,
      description: "Digital style guide with seasonal trends",
      category: "content",
    },
    {
      id: "5",
      name: "Personal Stylist Session",
      points: 1000,
      description: "30-minute virtual consultation with our stylist",
      category: "service",
    },
  ],
}

const tierConfig = {
  Bronze: {
    color: "bg-amber-600",
    icon: Award,
    minSpend: 0,
  },
  Silver: {
    color: "bg-gray-400",
    icon: Star,
    minSpend: 500,
  },
  Gold: {
    color: "bg-yellow-500",
    icon: Crown,
    minSpend: 1500,
  },
  Platinum: {
    color: "bg-purple-600",
    icon: Trophy,
    minSpend: 3000,
  },
}

export function LoyaltyProgram() {

  const progressToNextTier = (loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNextTier)) * 100

  const handleRedeemReward = (rewardId: string, pointsCost: number) => {
    if (loyaltyData.points >= pointsCost) {
      // In a real app, this would make an API call
      console.log(`Redeeming reward ${rewardId} for ${pointsCost} points`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const CurrentTierIcon = tierConfig[loyaltyData.currentTier as keyof typeof tierConfig].icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Loyalty Program
          </CardTitle>
          <CardDescription>Earn points with every purchase and unlock exclusive rewards</CardDescription>
        </CardHeader>
      </Card>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${tierConfig[loyaltyData.currentTier as keyof typeof tierConfig].color} text-white`}
              >
                <CurrentTierIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{loyaltyData.currentTier} Member</h3>
                <p className="text-muted-foreground">Member since {loyaltyData.memberSince}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-600">{loyaltyData.points.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Available Points</p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to {loyaltyData.nextTier}</span>
              <span>{loyaltyData.pointsToNextTier} points to go</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Tier Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Your {loyaltyData.currentTier} Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {loyaltyData.benefits[loyaltyData.currentTier as keyof typeof loyaltyData.benefits].map(
                (benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ),
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Next Tier Benefits */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              Unlock {loyaltyData.nextTier} Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {loyaltyData.benefits[loyaltyData.nextTier as keyof typeof loyaltyData.benefits].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                Spend ${(tierConfig.Platinum.minSpend - loyaltyData.totalSpent).toFixed(2)} more to unlock{" "}
                {loyaltyData.nextTier} status!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>Redeem your points for exclusive rewards and discounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyaltyData.availableRewards.map((reward) => {
              const canRedeem = loyaltyData.points >= reward.points

              return (
                <Card key={reward.id} className={`relative ${!canRedeem ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{reward.name}</h4>
                        <Badge variant={canRedeem ? "default" : "secondary"}>{reward.points} pts</Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{reward.description}</p>

                      <Button
                        size="sm"
                        className="w-full"
                        disabled={!canRedeem}
                        onClick={() => handleRedeemReward(reward.id, reward.points)}
                      >
                        {canRedeem ? "Redeem" : "Not Enough Points"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Points Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyData.recentActivity.map((activity) => {
              const isEarned = activity.type === "earned" || activity.type === "bonus"

              return (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isEarned ? "bg-green-100" : "bg-red-100"}`}>
                      {isEarned ? (
                        <Zap className="h-4 w-4 text-green-600" />
                      ) : (
                        <Gift className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                    </div>
                  </div>

                  <div className={`font-bold ${isEarned ? "text-green-600" : "text-red-600"}`}>
                    {activity.points > 0 ? "+" : ""}
                    {activity.points}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Make Purchases</h4>
              <p className="text-sm text-muted-foreground">1 point per $1 spent</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Write Reviews</h4>
              <p className="text-sm text-muted-foreground">50 points per review</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Birthday Bonus</h4>
              <p className="text-sm text-muted-foreground">200 points annually</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-medium">Referrals</h4>
              <p className="text-sm text-muted-foreground">500 points per friend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
