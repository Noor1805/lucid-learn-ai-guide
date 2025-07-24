import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, TrendingUp, DollarSign, Users, Search, ExternalLink } from 'lucide-react';
import { geminiService } from '@/lib/gemini';

const CareerConnect = () => {
  const [concept, setConcept] = useState('');
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const popularConcepts = [
    "Machine Learning",
    "Data Analysis",
    "Web Development",
    "Digital Marketing",
    "UX/UI Design",
    "Cybersecurity",
    "Cloud Computing",
    "Artificial Intelligence",
    "Blockchain",
    "Project Management"
  ];

  const exploreCareer = async () => {
    if (!concept.trim()) {
      toast({
        title: "Error",
        description: "Please enter a concept or skill to explore.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await geminiService.exploreCareerPaths(concept);
      setCareerData(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch career information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConcept = (selectedConcept) => {
    setConcept(selectedConcept);
    setCareerData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Career Connect
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover how your skills and interests connect to real-world careers
          </p>
        </div>

        {/* Search Section */}
        <Card className="border-border/50 backdrop-blur-sm bg-card/90 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-500" />
              Explore Career Paths
            </CardTitle>
            <CardDescription>
              Enter any concept, technology, or skill to discover related career opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a concept or skill (e.g., 'Python', 'Data Science', 'Digital Marketing')"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && exploreCareer()}
              />
              <Button
                onClick={exploreCareer}
                disabled={loading || !concept.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {loading ? (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
                    Exploring...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Explore Careers
                  </>
                )}
              </Button>
            </div>

            {/* Popular Concepts */}
            <div>
              <p className="text-sm font-medium mb-2">Popular Concepts:</p>
              <div className="flex flex-wrap gap-2">
                {popularConcepts.map((popularConcept, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadConcept(popularConcept)}
                    className="text-xs"
                  >
                    {popularConcept}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {careerData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Career Paths */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-indigo-500" />
                Career Opportunities in {concept}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careerData.career_paths.map((career, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 backdrop-blur-sm bg-card/90 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{career.title}</CardTitle>
                        <CardDescription>{career.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{career.salary_range}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-xs">{career.growth_outlook}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {career.skills_required.slice(0, 4).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {career.skills_required.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{career.skills_required.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">Education:</p>
                          <p className="text-xs text-muted-foreground">{career.education_requirements}</p>
                        </div>

                        {career.related_fields.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Related Fields:</p>
                            <div className="flex flex-wrap gap-1">
                              {career.related_fields.slice(0, 3).map((field, fieldIndex) => (
                                <Badge key={fieldIndex} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-4"
                          onClick={() =>
                            window.open(
                              `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career.title)}`,
                              '_blank'
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Jobs on LinkedIn
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Industry Trends */}
            {careerData.industry_trends.length > 0 && (
              <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Industry Trends
                  </CardTitle>
                  <CardDescription>
                    Current trends and developments in the {concept} field
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerData.industry_trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{trend}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skill Recommendations & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerData.skill_recommendations.length > 0 && (
                <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Skill Recommendations
                    </CardTitle>
                    <CardDescription>
                      Skills to develop for better opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {careerData.skill_recommendations.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {careerData.certification_suggestions.length > 0 && (
                <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className="h-5 w-5 text-purple-500" />
                      Recommended Certifications
                    </CardTitle>
                    <CardDescription>
                      Certifications that can boost your career prospects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {careerData.certification_suggestions.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!careerData && !loading && (
          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardContent className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Discover Your Career Path</h3>
              <p className="text-muted-foreground mb-6">
                Enter any skill, technology, or concept to explore related career opportunities and see how your interests translate to real-world jobs.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => loadConcept('Data Science')} variant="outline">
                  Try "Data Science" as an example
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default CareerConnect;