"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence,animate } from "framer-motion"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // If user scrolls down more than 300px, show the button
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility)

    // Clean up the listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top with smooth behavior
  const scrollToTop = () => {
    // Get the current scroll position
    const currentScrollY = window.scrollY

    // Use framer-motion's animate function for smooth scrolling
    const controls = animate(currentScrollY, 0, {
      duration: 0.8, // Adjust duration as needed
      onUpdate: (value) => {
        window.scrollTo(0, value)
      },
    })

    // Return the animation controls in case we need to stop it
    return controls
  }


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-25 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
