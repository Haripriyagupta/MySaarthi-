import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, MapPin, GraduationCap, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { College } from "@shared/schema";

export default function Colleges() {
  const [filters, setFilters] = useState({
    field: "",
    location: "",
    feeRange: ""
  });

  // Fetch colleges with filters
  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ["/api/colleges", filters.field, filters.location, filters.feeRange],
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatFee = (fee: number) => {
    if (fee >= 100000) {
      return `₹${(fee / 100000).toFixed(1)}L`;
    }
    return `₹${(fee / 1000).toFixed(0)}K`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">College Search & Comparison</h1>
            <p className="text-muted-foreground">
              Find and compare colleges based on your interests, budget, and career goals
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study</label>
                <Select value={filters.field} onValueChange={(value) => handleFilterChange('field', value)}>
                  <SelectTrigger data-testid="select-field">
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fields</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                  <SelectTrigger data-testid="select-location">
                    <SelectValue placeholder="All India" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All India</SelectItem>
                    <SelectItem value="Delhi">Delhi NCR</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fee Range (₹/year)</label>
                <Select value={filters.feeRange} onValueChange={(value) => handleFilterChange('feeRange', value)}>
                  <SelectTrigger data-testid="select-fee-range">
                    <SelectValue placeholder="Any Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Range</SelectItem>
                    <SelectItem value="0-200000">Under ₹2 Lakhs</SelectItem>
                    <SelectItem value="200000-500000">₹2-5 Lakhs</SelectItem>
                    <SelectItem value="500000-1000000">₹5-10 Lakhs</SelectItem>
                    <SelectItem value="1000000+">Above ₹10 Lakhs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full" data-testid="button-search-colleges">
                  <Search className="w-4 h-4 mr-2" />
                  Search Colleges
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {colleges?.length || 0} Colleges Found
            </h2>
          </div>

          {colleges && colleges.length > 0 ? (
            <div className="space-y-4">
              {colleges.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow" data-testid={`college-card-${college.id}`}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* College Info */}
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg mb-1">{college.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {college.location}
                        </div>
                        <Badge variant={college.type === 'government' ? 'default' : 'secondary'}>
                          {college.type}
                        </Badge>
                      </div>

                      {/* Courses */}
                      <div>
                        <div className="text-sm font-medium mb-1">Courses</div>
                        <div className="text-sm text-muted-foreground">
                          {(college.courses as any[])?.slice(0, 2).map((course, index) => (
                            <div key={index}>{course.name}</div>
                          ))}
                          {(college.courses as any[])?.length > 2 && (
                            <div className="text-xs text-primary">
                              +{(college.courses as any[]).length - 2} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fees */}
                      <div>
                        <div className="text-sm font-medium mb-1">Annual Fees</div>
                        <div className="text-lg font-semibold text-green-600">
                          {formatFee(Object.values(college.fees as any)[0] as number)}
                        </div>
                      </div>

                      {/* Placement */}
                      <div>
                        <div className="text-sm font-medium mb-1">Placement</div>
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatFee((college.placement as any).averagePackage)} avg
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {(college.placement as any).placementRate}% placed
                          </div>
                        </div>
                      </div>

                      {/* Rating & Action */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {renderStars(college.rating)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {college.rating}.0
                        </div>
                        <Button size="sm" variant="outline" data-testid={`button-view-details-${college.id}`}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Colleges Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ field: "", location: "", feeRange: "" })}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Why Choose the Right College?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Quality Education</h4>
                <p className="text-muted-foreground">
                  Accredited programs with experienced faculty and modern infrastructure ensure comprehensive learning.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Career Opportunities</h4>
                <p className="text-muted-foreground">
                  Strong placement records and industry connections open doors to excellent career prospects.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Return on Investment</h4>
                <p className="text-muted-foreground">
                  Consider fee structure against placement packages to make informed financial decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
